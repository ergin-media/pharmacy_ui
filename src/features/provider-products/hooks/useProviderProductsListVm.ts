import { useMemo, useState } from "react";
import {
    DEFAULT_PER_PAGE,
    DEFAULT_SORT,
    MAPPED_TABS,
} from "../lib/providerProducts.filters";
import type {
    ProviderProductsMappedFilter,
    ProviderProductsSort,
} from "../types/provider-products.dto";

export function useProviderProductsListVm() {
    const [page, setPage] = useState(1);
    const [perPage] = useState(DEFAULT_PER_PAGE);
    const [mapped, setMapped] = useState<ProviderProductsMappedFilter>(""); // "", "0", "1"
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<ProviderProductsSort>(DEFAULT_SORT);

    const tabValue = useMemo(() => {
        const hit = MAPPED_TABS.find((t) => t.mapped === mapped);
        return hit?.value ?? "all";
    }, [mapped]);

    return {
        state: { page, perPage, mapped, search, sort, tabValue },
        actions: {
            setPage,
            setMapped: (v: ProviderProductsMappedFilter) => {
                setPage(1);
                setMapped(v);
            },
            setSearch: (v: string) => {
                setPage(1);
                setSearch(v);
            },
            setSort: (v: ProviderProductsSort) => {
                setPage(1);
                setSort(v);
            },
            setTabValue: (v: "all" | "unmapped" | "mapped") => {
                const next =
                    MAPPED_TABS.find((t) => t.value === v)?.mapped ?? "";
                setPage(1);
                setMapped(next);
            },
        },
    };
}
