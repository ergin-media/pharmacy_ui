import type {
    ProviderProductsMappedFilter,
    ProviderProductsSort,
} from "../types/provider-products.dto";

export const DEFAULT_PER_PAGE = 25;

export const MAPPED_TABS: Array<{
    value: "all" | "unmapped" | "mapped";
    label: string;
    mapped: ProviderProductsMappedFilter;
}> = [
    { value: "all", label: "Alle", mapped: "" },
    { value: "unmapped", label: "Offen", mapped: "0" },
    { value: "mapped", label: "Gemappt", mapped: "1" },
];

export const DEFAULT_SORT: ProviderProductsSort = "usage_desc";
