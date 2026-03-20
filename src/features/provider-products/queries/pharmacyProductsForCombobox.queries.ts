import { usePharmacyProductsListQuery } from "@/features/pharmacy-products/queries/pharmacy-products.queries";

export function usePharmacyProductsForComboboxQuery(limit = 500) {
    return usePharmacyProductsListQuery(
        {
            page: 1,
            per_page: limit,
            sort: "name_asc",
        },
        {
            enabled: true,
        },
    );
}
