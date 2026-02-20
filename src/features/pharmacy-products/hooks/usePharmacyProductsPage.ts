import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import { useDebouncedValue } from "@/shared/lib/hooks/useDebouncedValue";
import {
    spGetInt,
    spGetString,
    spSetInt,
    spSetOrDelete,
} from "@/shared/lib/url/searchParams";

import { usePharmacyProductsListQuery } from "../queries/pharmacy-products.queries";
import {
    ALLOWED_SORTS,
    DEFAULT_PER_PAGE,
    DEFAULT_SORT,
} from "../lib/pharmacy-products.constants";
import type { PharmacyProductsSort } from "../types/pharmacy-products.dto";

export function usePharmacyProductsPage() {
    const [sp, setSp] = useSearchParams();

    const page = Math.max(1, spGetInt(sp, "page", 1));
    const perPage = Math.max(
        1,
        Math.min(100, spGetInt(sp, "per_page", DEFAULT_PER_PAGE)),
    );

    const activeRaw = spGetString(sp, "active"); // "", "1", "0", "true", "false"
    const active =
        activeRaw === "1" ||
        activeRaw === "0" ||
        activeRaw === "true" ||
        activeRaw === "false"
            ? activeRaw
            : undefined;

    const manufacturerRaw = spGetString(sp, "manufacturer");
    const manufacturer = manufacturerRaw ? manufacturerRaw : undefined;

    const sortRaw = spGetString(sp, "sort");
    const sort: PharmacyProductsSort = (
        ALLOWED_SORTS as readonly string[]
    ).includes(sortRaw)
        ? (sortRaw as PharmacyProductsSort)
        : DEFAULT_SORT;

    // Search: URL -> local input
    const searchRaw = spGetString(sp, "search");
    const [searchInput, setSearchInput] = useState(searchRaw);

    useEffect(() => {
        setSearchInput(searchRaw);
    }, [searchRaw]);

    const debouncedSearch = useDebouncedValue(
        searchInput.trim() || undefined,
        500,
    );

    function patch(
        next: Partial<{
            page: number;
            per_page: number;
            active: string;
            manufacturer: string;
            search: string;
            sort: string;
        }>,
    ) {
        const n = new URLSearchParams(sp);

        if (next.page !== undefined) spSetInt(n, "page", next.page);
        if (next.per_page !== undefined) spSetInt(n, "per_page", next.per_page);

        if (next.active !== undefined) spSetOrDelete(n, "active", next.active);
        if (next.manufacturer !== undefined)
            spSetOrDelete(n, "manufacturer", next.manufacturer);

        if (next.sort !== undefined) spSetOrDelete(n, "sort", next.sort);

        setSp(n, { replace: true });
    }

    // debounced search -> URL
    useEffect(() => {
        const n = new URLSearchParams(sp);
        spSetInt(n, "page", 1);
        spSetOrDelete(n, "search", debouncedSearch ?? "");
        setSp(n, { replace: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const params = useMemo(
        () => ({
            page,
            per_page: perPage,
            active,
            manufacturer,
            search: debouncedSearch,
            sort,
        }),
        [page, perPage, active, manufacturer, debouncedSearch, sort],
    );

    const query = usePharmacyProductsListQuery(params);

    const total = query.data?.total ?? 0;
    const totalPages = query.data?.total_pages ?? 1;

    const actions = {
        setActive: (v: string) => patch({ page: 1, active: v }), // "" erlaubt
        setManufacturer: (v: string) => patch({ page: 1, manufacturer: v }),
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
            activeRaw: activeRaw ?? "",
            manufacturerRaw: manufacturerRaw ?? "",
            searchRaw: searchInput,
            sort,
        },
        query,
        meta: { total, totalPages },
        actions,
    };
}
