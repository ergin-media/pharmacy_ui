import { usePharmacyProductsListQuery } from "@/features/pharmacy-products/queries/pharmacy-products.queries";

export function usePharmacyProductsForMappingQuery(search: string) {
    return usePharmacyProductsListQuery({
        page: 1,
        per_page: 25,
        sort: "name_asc",
        search,
    });
}
