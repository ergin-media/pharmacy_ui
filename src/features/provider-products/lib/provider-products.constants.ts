import type { ProviderProductsSort } from "../types/provider-products.dto";

/**
 * Pagination
 */
export const PER_PAGE_OPTIONS = [25, 50, 100, 200] as const;
export const DEFAULT_PER_PAGE = 25;

/**
 * Sortierung
 * (muss exakt mit Backend allowedSort matchen)
 */
export const SORT_OPTIONS = [
    { value: "usage_desc", label: "Nutzung absteigend" },
    { value: "usage_asc", label: "Nutzung aufsteigend" },
    { value: "updated_at_desc", label: "Aktualisiert absteigend" },
    { value: "updated_at_asc", label: "Aktualisiert aufsteigend" },
    { value: "name_desc", label: "Externer Name absteigend" },
    { value: "name_asc", label: "Externer Name aufsteigend" },
] as const;

export const DEFAULT_SORT: ProviderProductsSort = "name_asc";

export const ALLOWED_SORTS = SORT_OPTIONS.map(
    (s) => s.value,
) as ProviderProductsSort[];

/**
 * Tabs: Alle / Offen / Gemappt
 * mapped = "" | "0" | "1"
 */
export const MAPPED_TABS = [
    { value: "all", label: "Alle", mapped: "" },
    { value: "unmapped", label: "Offen", mapped: "0" },
    { value: "mapped", label: "Gemappt", mapped: "1" },
] as const;

export type MappedTabValue = (typeof MAPPED_TABS)[number]["value"];
export type MappedFilterValue = (typeof MAPPED_TABS)[number]["mapped"];
