import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import { useDebouncedValue } from "@/shared/lib/hooks/useDebouncedValue";
import {
    spGetInt,
    spGetString,
    spSetInt,
    spSetOrDelete,
} from "@/shared/lib/url/searchParams";

import { useProviderProductsListQuery } from "../queries/providerProducts.queries";
import {
    DEFAULT_PER_PAGE,
    DEFAULT_SORT,
    ALLOWED_SORTS,
} from "../lib/provider-products.constants";
import type {
    ProviderProductsMappedFilter,
    ProviderProductsSort,
} from "../types/provider-products.dto";

const MAPPED_ALLOWED = ["", "0", "1"] as const;

export function useProviderProductsListPage() {
    const [sp, setSp] = useSearchParams();

    const page = Math.max(1, spGetInt(sp, "page", 1));
    const perPage = Math.max(
        1,
        Math.min(200, spGetInt(sp, "per_page", DEFAULT_PER_PAGE)),
    );

    const mappedRaw = spGetString(sp, "mapped") ?? "";
    const mapped: ProviderProductsMappedFilter = (
        MAPPED_ALLOWED as readonly string[]
    ).includes(mappedRaw)
        ? (mappedRaw as ProviderProductsMappedFilter)
        : "";

    const sortRaw = spGetString(sp, "sort") ?? "";
    const sort: ProviderProductsSort = (
        ALLOWED_SORTS as readonly string[]
    ).includes(sortRaw)
        ? (sortRaw as ProviderProductsSort)
        : DEFAULT_SORT;

    // Search: URL -> local input (für controlled Input)
    const searchRaw = spGetString(sp, "search") ?? "";
    const [searchInput, setSearchInput] = useState(searchRaw);

    useEffect(() => {
        setSearchInput(searchRaw);
    }, [searchRaw]);

    const debouncedSearch = useDebouncedValue(searchInput.trim(), 500);
    const debouncedSearchParam = debouncedSearch || undefined;

    function patch(
        next: Partial<{
            page: number;
            per_page: number;
            mapped: ProviderProductsMappedFilter;
            sort: ProviderProductsSort;
        }>,
    ) {
        const n = new URLSearchParams(sp);

        if (next.page !== undefined) spSetInt(n, "page", next.page);
        if (next.per_page !== undefined) spSetInt(n, "per_page", next.per_page);

        if (next.mapped !== undefined) spSetOrDelete(n, "mapped", next.mapped); // "" => löschen
        if (next.sort !== undefined) spSetOrDelete(n, "sort", next.sort);

        setSp(n, { replace: true });
    }

    // debounced search -> URL (und page reset)
    useEffect(() => {
        const n = new URLSearchParams(sp);
        spSetInt(n, "page", 1);
        spSetOrDelete(n, "search", debouncedSearch);
        setSp(n, { replace: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const params = useMemo(
        () => ({
            page,
            per_page: perPage,
            mapped: mapped === "" ? undefined : mapped,
            search: debouncedSearchParam,
            sort,
        }),
        [page, perPage, mapped, debouncedSearchParam, sort],
    );

    const query = useProviderProductsListQuery(params);

    const total = query.data?.total ?? 0;
    const totalPages = query.data?.total_pages ?? 1;

    const actions = {
        setTabValue: (v: "all" | "unmapped" | "mapped") => {
            const next: ProviderProductsMappedFilter =
                v === "unmapped" ? "0" : v === "mapped" ? "1" : "";
            patch({ page: 1, mapped: next });
        },
        setSearch: (v: string) => setSearchInput(v),
        setSort: (v: ProviderProductsSort) => patch({ page: 1, sort: v }),
        setPerPage: (v: number) => patch({ page: 1, per_page: v }),
        setPage: (v: number) => patch({ page: v }),
        refresh: () => query.refetch(),
    };

    return {
        filters: {
            page,
            perPage,
            mapped, // "", "0", "1"
            searchInput, // controlled input value
            sort,
            tabValue:
                mapped === "0" ? "unmapped" : mapped === "1" ? "mapped" : "all",
        },
        query,
        meta: { total, totalPages },
        actions,
    };
}
