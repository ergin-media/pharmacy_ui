import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import { useReparseRxMutation, useRxListQuery } from "../queries/rx.queries";
import type {
    RxParseStatus,
    RxWorkflowStatus,
    RxPaymentState,
    RxListQueryParams,
    RxQueueCounts,
} from "../types/rx.dto";
import {
    ALLOWED_WORKFLOW,
    ALLOWED_PAYMENT,
    ALLOWED_SORTS,
    ALLOWED_STATUSES,
    DEFAULT_SORT,
    type RxSort,
} from "../lib/rx.constants";
import { RX_QUEUE_ORDER, type RxQueue } from "../lib/rx.queues";

import {
    spGetInt,
    spGetString,
    spSetInt,
    spSetOrDelete,
} from "@/shared/lib/url/searchParams";
import { useDebouncedValue } from "@/shared/lib/hooks/useDebouncedValue";

function normalizeQueue(v: string | null): RxQueue | undefined {
    const s = (v ?? "").trim() as RxQueue;
    return RX_QUEUE_ORDER.includes(s) ? s : undefined;
}

type PatchValues = Partial<{
    page: number;
    per_page: number;
    queue: string;
    parse_status: string;
    workflow_status: string;
    payment_state: string;
    provider: string;
    search: string;
    sort: string;
}>;

export function useRxListPage() {
    const [sp, setSp] = useSearchParams();

    const page = Math.max(1, spGetInt(sp, "page", 1));
    const perPage = Math.max(1, Math.min(100, spGetInt(sp, "per_page", 10)));

    const queue = normalizeQueue(spGetString(sp, "queue"));

    const parseStatusRaw = spGetString(sp, "parse_status") ?? "";
    const parseStatus: RxParseStatus | undefined = (
        ALLOWED_STATUSES as readonly string[]
    ).includes(parseStatusRaw)
        ? (parseStatusRaw as RxParseStatus)
        : undefined;

    const workflowRaw = spGetString(sp, "workflow_status") ?? "";
    const workflowStatus: RxWorkflowStatus | undefined = (
        ALLOWED_WORKFLOW as readonly string[]
    ).includes(workflowRaw)
        ? (workflowRaw as RxWorkflowStatus)
        : undefined;

    const paymentRaw = spGetString(sp, "payment_state") ?? "";
    const paymentState: RxPaymentState | undefined = (
        ALLOWED_PAYMENT as readonly string[]
    ).includes(paymentRaw)
        ? (paymentRaw as RxPaymentState)
        : undefined;

    const providerRaw = spGetString(sp, "provider") ?? "";
    const provider = providerRaw || undefined;

    const searchRaw = spGetString(sp, "search") ?? "";
    const [searchInput, setSearchInput] = useState(searchRaw);

    useEffect(() => {
        setSearchInput(searchRaw);
    }, [searchRaw]);

    const debouncedSearch = useDebouncedValue(searchInput.trim(), 500);
    const debouncedSearchParam = debouncedSearch || undefined;

    const sortRaw = spGetString(sp, "sort") ?? "";
    const sort: RxSort = (ALLOWED_SORTS as readonly string[]).includes(sortRaw)
        ? (sortRaw as RxSort)
        : DEFAULT_SORT;

    function patch(values: PatchValues) {
        const next = new URLSearchParams(sp);

        for (const [key, value] of Object.entries(values)) {
            if (value === undefined) continue;

            if (typeof value === "number") {
                spSetInt(next, key, value);
            } else {
                spSetOrDelete(next, key, value);
            }
        }

        setSp(next, { replace: true });
    }

    function resetToAll() {
        const next = new URLSearchParams();
        spSetInt(next, "page", 1);
        setSp(next, { replace: true });
    }

    useEffect(() => {
        const next = new URLSearchParams(sp);
        spSetInt(next, "page", 1);
        spSetOrDelete(next, "search", debouncedSearch);
        setSp(next, { replace: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const params = useMemo<RxListQueryParams>(
        () => ({
            page,
            per_page: perPage,
            queue: queue && queue !== "all" ? queue : undefined,
            parse_status: parseStatus,
            workflow_status: workflowStatus,
            payment_state: paymentState,
            provider,
            search: debouncedSearchParam,
            sort,
        }),
        [
            page,
            perPage,
            queue,
            parseStatus,
            workflowStatus,
            paymentState,
            provider,
            debouncedSearchParam,
            sort,
        ],
    );

    const query = useRxListQuery(params);

    const reparseMutation = useReparseRxMutation();
    const reparseBusyId =
        reparseMutation.isPending &&
            typeof reparseMutation.variables === "number"
            ? reparseMutation.variables
            : null;

    const total = query.data?.total ?? 0;
    const totalPages =
        query.data?.total_pages && query.data.total_pages > 0
            ? query.data.total_pages
            : 1;

    const queueCounts: RxQueueCounts = query.data?.queue_counts ?? {};

    const actions = {
        setQueue: (value: RxQueue) => {
            if (value === "all") {
                resetToAll();
                return;
            }

            patch({
                page: 1,
                queue: value,
            });
        },

        setParseStatus: (value: string) =>
            patch({
                page: 1,
                parse_status: value === "all" ? "" : value,
            }),

        setWorkflowStatus: (value: string) =>
            patch({
                page: 1,
                workflow_status: value,
            }),

        setPaymentState: (value: string) =>
            patch({
                page: 1,
                payment_state: value,
            }),

        setProvider: (value: string) =>
            patch({
                page: 1,
                provider: value,
            }),

        setSearch: (value: string) => setSearchInput(value),

        setSort: (value: string) =>
            patch({
                page: 1,
                sort: value,
            }),

        setPerPage: (value: number) =>
            patch({
                page: 1,
                per_page: value,
            }),

        setPage: (value: number) =>
            patch({
                page: value,
            }),

        refresh: () => query.refetch(),

        reparse: async (id: number) => {
            await reparseMutation.mutateAsync(id);
        },
    };

    return {
        filters: {
            page,
            perPage,
            queue,
            tabValue: (queue ?? "all") as RxQueue,
            parseStatus,
            workflowStatus,
            paymentState,
            providerRaw,
            searchRaw: searchInput,
            sort,
        },
        query,
        meta: {
            total,
            totalPages,
            queueCounts,
            reparseBusyId,
            isReparseBusy: reparseMutation.isPending,
        },
        actions,
    };
}