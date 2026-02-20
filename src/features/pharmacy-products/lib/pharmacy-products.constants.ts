import type { PharmacyProductsSort } from "../types/pharmacy-products.dto";

export const ALLOWED_SORTS = [
    "created_at_desc",
    "created_at_asc",
    "name_asc",
    "name_desc",
    "price_asc",
    "price_desc",
] as const satisfies readonly PharmacyProductsSort[];

export const DEFAULT_SORT: PharmacyProductsSort = "created_at_desc";

export const DEFAULT_PER_PAGE = 25;

export const ACTIVE_FILTERS = [
    { value: "", label: "Alle" },
    { value: "1", label: "Aktiv" },
    { value: "0", label: "Inaktiv" },
] as const;
