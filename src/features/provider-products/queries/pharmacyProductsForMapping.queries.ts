import { usePharmacyProductsListQuery } from "@/features/pharmacy-products/queries/pharmacy-products.queries";

export function usePharmacyProductsForMappingQuery(search: string) {
    const normalizedSearch = search.trim();

    const enabled =
        normalizedSearch.length === 0 || normalizedSearch.length >= 2;

    return usePharmacyProductsListQuery(
        {
            page: 1,
            per_page: 25,
            sort: "name_asc",
            search: normalizedSearch || undefined,
        },
        {
            enabled,
        },
    );
}