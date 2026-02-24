import type { PharmacyProductsSort } from "../types/pharmacy-products.dto";

export const PER_PAGE_OPTIONS = [25, 50, 100] as const;

export const SORT_OPTIONS = [
    { value: "name_asc", label: "Name aufsteigend" },
    { value: "name_desc", label: "Name absteigend" },
    { value: "price_asc", label: "Preis aufsteigend" },
    { value: "price_desc", label: "Preis absteigend" },
    { value: "updated_at_desc", label: "Aktualisiert absteigend" },
    { value: "updated_at_asc", label: "Aktualisiert aufsteigend" },
] as const;

export const DEFAULT_SORT: PharmacyProductsSort = "name_asc";
export const ALLOWED_SORTS = SORT_OPTIONS.map(
    (s) => s.value,
) as PharmacyProductsSort[];

export const DEFAULT_PER_PAGE = 25;

export const ACTIVE_FILTERS = [
    { value: "1", label: "Aktive Produkte" },
    { value: "0", label: "Inaktiv Produkte" },
] as const;

export type ActiveFilterValue = (typeof ACTIVE_FILTERS)[number]["value"];
