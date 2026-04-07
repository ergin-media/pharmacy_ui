import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import type {
    RxParseStatus,
    RxWorkflowStatus,
    RxPaymentState,
    RxStatus,
} from "../types/rx.dto";
import type { RxProcessingTab } from "../lib/rx.processing-tabs";
import {
    ALLOWED_WORKFLOW,
    ALLOWED_PAYMENT,
    ALLOWED_SORTS,
    ALLOWED_STATUSES,
    DEFAULT_SORT,
    DEFAULT_PER_PAGE,
    type RxSort,
} from "../lib/rx.constants";

import {
    spGetInt,
    spGetString,
    spSetInt,
    spSetOrDelete,
} from "@/shared/lib/url/searchParams";
import { useDebouncedValue } from "@/shared/lib/hooks/useDebouncedValue";

type RxListPanelStatus = RxStatus | "attention";

type PatchValues = Partial<{
    page: number;
    per_page: number;
    status: string;
    processing_tab: string;
    parse_status: string;
    workflow_status: string;
    payment_state: string;
    provider: string;
    search: string;
    sort: string;
}>;

function normalizeStatus(v: string | null): RxListPanelStatus | undefined {
    const value = (v ?? "").trim();

    if (
        value === "new" ||
        value === "processing" ||
        value === "completed" ||
        value === "attention"
    ) {
        return value;
    }

    return undefined;
}

function normalizeProcessingTab(v: string | null): RxProcessingTab | undefined {
    const value = (v ?? "").trim();

    if (
        value === "all" ||
        value === "awaiting_payment" ||
        value === "paid" ||
        value === "shipping_ready" ||
        value === "pickup_ready"
    ) {
        return value as RxProcessingTab;
    }

    return undefined;
}

export function useRxListFilters() {
    const [sp, setSp] = useSearchParams();

    const page = Math.max(1, spGetInt(sp, "page", 1));
    const perPage = Math.max(
        1,
        Math.min(100, spGetInt(sp, "per_page", DEFAULT_PER_PAGE)),
    );

    const status = normalizeStatus(spGetString(sp, "status"));
    const processingTab = normalizeProcessingTab(
        spGetString(sp, "processing_tab"),
    );

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

    const filters = useMemo(
        () => ({
            page,
            perPage,
            status,
            processingTab,
            parseStatus,
            workflowStatus,
            paymentState,
            providerRaw,
            provider,
            searchRaw: searchInput,
            search: debouncedSearchParam,
            sort,
        }),
        [
            page,
            perPage,
            status,
            processingTab,
            parseStatus,
            workflowStatus,
            paymentState,
            providerRaw,
            provider,
            searchInput,
            debouncedSearchParam,
            sort,
        ],
    );

    const actions = {
        setStatus: (value?: RxListPanelStatus) => {
            if (!value) {
                resetToAll();
                return;
            }

            patch({
                page: 1,
                status: value,
                processing_tab: "",
            });
        },

        setProcessingTab: (value?: RxProcessingTab) =>
            patch({
                page: 1,
                processing_tab: !value || value === "all" ? "" : value,
            }),

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
    };

    return {
        filters,
        actions,
    };
}