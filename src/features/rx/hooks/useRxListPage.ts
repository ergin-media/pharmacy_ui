import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { useRxListQuery } from "../queries/rx.queries";
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
    const searchRaw = spGetString(sp, "search"); // source of truth for deep-linking
    const [searchInput, setSearchInput] = useState(searchRaw);

    // Wenn URL sich extern ändert (Back/Forward/Link), Input synchronisieren
    useEffect(() => {
        setSearchInput(searchRaw);
    }, [searchRaw]);

    // Debounce auf Input
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

            workflow_status: string; // neu
            payment_state: string; // neu

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

        // search NICHT mehr pro Tastendruck hier setzen!
        if (next.sort !== undefined) spSetOrDelete(n, "sort", next.sort);

        setSp(n, { replace: true });
    }

    // URL-Param "search" nur debounced schreiben (und page reset)
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
            workflow_status: workflowStatus, // neu
            payment_state: paymentState, // neu
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

    const total = query.data?.total ?? 0;
    const totalPages = query.data?.total_pages ?? 1;

    const actions = {
        setParseStatus: (v: string) =>
            patch({ page: 1, parse_status: v === "all" ? "" : v }),

        setWorkflowStatus: (v: string) =>
            patch({ page: 1, workflow_status: v }), // v ist "" oder status

        setPaymentState: (v: string) => patch({ page: 1, payment_state: v }), // v ist "" oder state

        setProvider: (v: string) => patch({ page: 1, provider: v }),

        setSearch: (v: string) => setSearchInput(v),

        setSort: (v: string) => patch({ page: 1, sort: v }),
        setPerPage: (v: number) => patch({ page: 1, per_page: v }),
        setPage: (v: number) => patch({ page: v }),
        refresh: () => query.refetch(),
    };

    return {
        filters: {
            page,
            perPage,
            parseStatus,

            workflowStatus, // neu
            paymentState, // neu

            providerRaw,
            searchRaw: searchInput,
            sort,
        },
        query,
        meta: { total, totalPages },
        actions,
    };
}
