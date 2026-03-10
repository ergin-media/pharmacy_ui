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
    DEFAULT_PER_PAGE,
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
    const perPage = Math.max(
        1,
        Math.min(100, spGetInt(sp, "per_page", DEFAULT_PER_PAGE)),
    );

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

        if (perPage !== DEFAULT_PER_PAGE) {
            spSetInt(next, "per_page", perPage);
        }

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

    const items = query.data?.items ?? [];
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

    const queueVm = {
        value: (queue ?? "all") as RxQueue,
        counts: queueCounts,
        setQueue: actions.setQueue,
    };

    const toolbarVm = {
        total,
        page,
        totalPages,
        parseStatus,
        workflowStatus,
        paymentState,
        providerRaw,
        searchRaw: searchInput,
        sort,
        perPage,
        isFetching: query.isFetching,
        onParseStatusChange: actions.setParseStatus,
        onWorkflowStatusChange: actions.setWorkflowStatus,
        onPaymentStateChange: actions.setPaymentState,
        onProviderChange: actions.setProvider,
        onSearchChange: actions.setSearch,
        onSortChange: actions.setSort,
        onPerPageChange: actions.setPerPage,
        onRefresh: actions.refresh,
    };

    const listVm = {
        page,
        total,
        totalPages,
        isFetching: query.isFetching,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.isError ? query.error : null,
        setPage: actions.setPage,
        refresh: actions.refresh,
    };

    const tableVm = {
        queue: (queue ?? "all") as RxQueue,
        items,
        page,
        perPage,
        isLoading: query.isFetching,
        reparseBusyId,
        onReparse: actions.reparse,
    };

    return {
        query,
        queueVm,
        toolbarVm,
        listVm,
        tableVm,
    };
}
