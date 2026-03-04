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

import {
    spGetInt,
    spGetString,
    spSetInt,
    spSetOrDelete,
} from "@/shared/lib/url/searchParams";
import { useDebouncedValue } from "@/shared/lib/hooks/useDebouncedValue";
import type { RxQueue } from "../lib/rx.queues";

const QUEUES = [
    "inbox",
    "offer_create",
    "offer_send",
    "await_payment",
    "paid_not_started",
    "packaging",
    "shipping",
    "pickup",
    "completed",
    "clarify",
] as const;

function normalizeQueue(v: string | null): RxQueue | undefined {
    const s = (v ?? "").trim();
    return (QUEUES as readonly string[]).includes(s)
        ? (s as RxQueue)
        : undefined;
}

export function useRxListPage() {
    const [sp, setSp] = useSearchParams();

    const page = Math.max(1, spGetInt(sp, "page", 1));
    const perPage = Math.max(1, Math.min(100, spGetInt(sp, "per_page", 10)));

    // ✅ UI Tabs steuern direkt queue
    const queue = normalizeQueue(spGetString(sp, "queue"));

    // optional advanced filters
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
    const provider = providerRaw ? providerRaw : undefined;

    // Search (controlled)
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

    function patch(
        next: Partial<{
            page: number;
            per_page: number;
            queue: string;
            parse_status: string;
            workflow_status: string;
            payment_state: string;
            provider: string;
            search: string;
            sort: string;
        }>,
    ) {
        const n = new URLSearchParams(sp);

        if (next.page !== undefined) spSetInt(n, "page", next.page);
        if (next.per_page !== undefined) spSetInt(n, "per_page", next.per_page);

        if (next.queue !== undefined) spSetOrDelete(n, "queue", next.queue);

        if (next.parse_status !== undefined)
            spSetOrDelete(n, "parse_status", next.parse_status);
        if (next.workflow_status !== undefined)
            spSetOrDelete(n, "workflow_status", next.workflow_status);
        if (next.payment_state !== undefined)
            spSetOrDelete(n, "payment_state", next.payment_state);

        if (next.provider !== undefined)
            spSetOrDelete(n, "provider", next.provider);
        if (next.sort !== undefined) spSetOrDelete(n, "sort", next.sort);

        setSp(n, { replace: true });
    }

    // debounced search -> URL (+ page reset)
    useEffect(() => {
        const n = new URLSearchParams(sp);
        spSetInt(n, "page", 1);
        spSetOrDelete(n, "search", debouncedSearch);
        setSp(n, { replace: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const params = useMemo<RxListQueryParams>(
        () => ({
            page,
            per_page: perPage,

            // ✅ Backend Queue steuert Hauptfilter
            queue,

            // optional advanced filters (kannst du später auch deaktivieren)
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
        query.data?.total_pages && query.data?.total_pages > 0
            ? query.data?.total_pages
            : 1;
    const queueCounts: RxQueueCounts = query.data?.queue_counts ?? {};

    const actions = {
        // ✅ Tabs -> queue setzen
        setQueue: (v: RxQueue | "") =>
            patch({
                page: 1,
                queue: v,
            }),

        // optional advanced actions
        setParseStatus: (v: string) =>
            patch({ page: 1, parse_status: v === "all" ? "" : v }),
        setWorkflowStatus: (v: string) =>
            patch({ page: 1, workflow_status: v }),
        setPaymentState: (v: string) => patch({ page: 1, payment_state: v }),
        setProvider: (v: string) => patch({ page: 1, provider: v }),

        setSearch: (v: string) => setSearchInput(v),
        setSort: (v: string) => patch({ page: 1, sort: v }),
        setPerPage: (v: number) => patch({ page: 1, per_page: v }),
        setPage: (v: number) => patch({ page: v }),

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
            tabValue: (queue ?? "inbox") as RxQueue, // default Tab

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
