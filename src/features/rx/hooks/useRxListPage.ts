import { useMemo } from "react";
import { useSearchParams } from "react-router";
import { useRxListQuery } from "../queries/rx.queries";
import type { RxParseStatus } from "../types/rx.dto";
import {
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

export function useRxListPage() {
    const [sp, setSp] = useSearchParams();

    // ---- read URL params (normalized) ----
    const page = Math.max(1, spGetInt(sp, "page", 1));
    const perPage = Math.max(1, Math.min(100, spGetInt(sp, "per_page", 25)));

    const parseStatusRaw = spGetString(sp, "parse_status");
    const parseStatus: RxParseStatus | undefined = (
        ALLOWED_STATUSES as string[]
    ).includes(parseStatusRaw)
        ? (parseStatusRaw as RxParseStatus)
        : undefined;

    const providerRaw = spGetString(sp, "provider");
    const provider = providerRaw ? providerRaw : undefined;

    const searchRaw = spGetString(sp, "search");
    const search = searchRaw ? searchRaw : undefined;

    const sortRaw = spGetString(sp, "sort");
    const sort: RxSort = (ALLOWED_SORTS as readonly string[]).includes(sortRaw)
        ? (sortRaw as RxSort)
        : DEFAULT_SORT;

    // params object for react-query (no useMemo required if queryKey uses primitives/object hashing)
    const params = useMemo(
        () => ({
            page,
            per_page: perPage,
            parse_status: parseStatus,
            provider,
            search,
            sort,
        }),
        [page, perPage, parseStatus, provider, search, sort],
    );

    const query = useRxListQuery(params);

    const total = query.data?.total ?? 0;
    const totalPages = query.data?.total_pages ?? 1;

    function patch(
        next: Partial<{
            page: number;
            per_page: number;
            parse_status: string;
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
        if (next.search !== undefined) spSetOrDelete(n, "search", next.search);
        if (next.sort !== undefined) spSetOrDelete(n, "sort", next.sort);

        setSp(n, { replace: true });
    }

    // Actions for UI components
    const actions = {
        setParseStatus: (v: string) =>
            patch({ page: 1, parse_status: v === "all" ? "" : v }),
        setProvider: (v: string) => patch({ page: 1, provider: v }),
        setSearch: (v: string) => patch({ page: 1, search: v }),
        setSort: (v: string) => patch({ page: 1, sort: v }),
        setPerPage: (v: number) => patch({ page: 1, per_page: v }),
        setPage: (v: number) => patch({ page: v }),
        refresh: () => query.refetch(),
    };

    return {
        // state
        filters: {
            page,
            perPage,
            parseStatus,
            providerRaw,
            searchRaw,
            sort,
        },

        // data
        query,
        meta: { total, totalPages },

        // actions
        actions,
    };
}
