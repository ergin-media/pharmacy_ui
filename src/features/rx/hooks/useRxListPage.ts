import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import { useReparseRxMutation, useRxListQuery } from "../queries/rx.queries";
import type {
    RxParseStatus,
    RxWorkflowStatus,
    RxPaymentState,
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

export function useRxListPage() {
    const [sp, setSp] = useSearchParams();

    const page = Math.max(1, spGetInt(sp, "page", 1));
    const perPage = Math.max(1, Math.min(100, spGetInt(sp, "per_page", 10)));

    const parseStatusRaw = spGetString(sp, "parse_status");
    const parseStatus: RxParseStatus | undefined = (
        ALLOWED_STATUSES as string[]
    ).includes(parseStatusRaw)
        ? (parseStatusRaw as RxParseStatus)
        : undefined;

    const providerRaw = spGetString(sp, "provider");
    const provider = providerRaw ? providerRaw : undefined;

    const workflowRaw = spGetString(sp, "workflow_status");
    const workflowStatus: RxWorkflowStatus | undefined = (
        ALLOWED_WORKFLOW as string[]
    ).includes(workflowRaw)
        ? (workflowRaw as RxWorkflowStatus)
        : undefined;

    const paymentRaw = spGetString(sp, "payment_state");
    const paymentState: RxPaymentState | undefined = (
        ALLOWED_PAYMENT as string[]
    ).includes(paymentRaw)
        ? (paymentRaw as RxPaymentState)
        : undefined;

    // --- Search: URL -> local input state ---
    const searchRaw = spGetString(sp, "search");
    const [searchInput, setSearchInput] = useState(searchRaw);

    useEffect(() => {
        setSearchInput(searchRaw);
    }, [searchRaw]);

    const debouncedSearchInput = useDebouncedValue(
        searchInput.trim() || undefined,
        500,
    );

    const sortRaw = spGetString(sp, "sort");
    const sort: RxSort = (ALLOWED_SORTS as readonly string[]).includes(sortRaw)
        ? (sortRaw as RxSort)
        : DEFAULT_SORT;

    function patch(
        next: Partial<{
            page: number;
            per_page: number;
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

        if (next.parse_status !== undefined)
            spSetOrDelete(n, "parse_status", next.parse_status);

        if (next.provider !== undefined)
            spSetOrDelete(n, "provider", next.provider);

        if (next.workflow_status !== undefined)
            spSetOrDelete(n, "workflow_status", next.workflow_status);

        if (next.payment_state !== undefined)
            spSetOrDelete(n, "payment_state", next.payment_state);

        if (next.sort !== undefined) spSetOrDelete(n, "sort", next.sort);

        setSp(n, { replace: true });
    }

    useEffect(() => {
        const n = new URLSearchParams(sp);
        spSetInt(n, "page", 1);
        spSetOrDelete(n, "search", debouncedSearchInput ?? "");
        setSp(n, { replace: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchInput]);

    const params = useMemo(
        () => ({
            page,
            per_page: perPage,
            parse_status: parseStatus,
            workflow_status: workflowStatus,
            payment_state: paymentState,
            provider,
            search: debouncedSearchInput,
            sort,
        }),
        [
            page,
            perPage,
            parseStatus,
            workflowStatus,
            paymentState,
            provider,
            debouncedSearchInput,
            sort,
        ],
    );

    const query = useRxListQuery(params);

    // ✅ NEW: Reparse mutation
    const reparseMutation = useReparseRxMutation();

    // ✅ busy row id (nur die eine Zeile)
    const reparseBusyId =
        reparseMutation.isPending && typeof reparseMutation.variables === "number"
            ? reparseMutation.variables
            : null;

    const total = query.data?.total ?? 0;
    const totalPages = query.data?.total_pages ?? 1;

    const actions = {
        setParseStatus: (v: string) =>
            patch({ page: 1, parse_status: v === "all" ? "" : v }),

        setWorkflowStatus: (v: string) => patch({ page: 1, workflow_status: v }),

        setPaymentState: (v: string) => patch({ page: 1, payment_state: v }),

        setProvider: (v: string) => patch({ page: 1, provider: v }),

        setSearch: (v: string) => setSearchInput(v),

        setSort: (v: string) => patch({ page: 1, sort: v }),
        setPerPage: (v: number) => patch({ page: 1, per_page: v }),
        setPage: (v: number) => patch({ page: v }),

        refresh: () => query.refetch(),

        // ✅ NEW: Reparse Action
        reparse: async (id: number) => {
            await reparseMutation.mutateAsync(id);
        },
    };

    return {
        filters: {
            page,
            perPage,
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

            // ✅ NEW: expose reparse state
            reparseBusyId,
            isReparseBusy: reparseMutation.isPending,
        },

        actions,
    };
}