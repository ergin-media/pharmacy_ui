import { useQuery } from "@tanstack/react-query";
import type { PharmacyProductsListParams } from "../types/pharmacy-products.dto";
import { fetchPharmacyProducts } from "../api/pharmacy-products.api";

export const pharmacyProductsKeys = {
    all: ["pharmacy-products"] as const,
    list: (params: PharmacyProductsListParams) =>
        [...pharmacyProductsKeys.all, "list", params] as const,
};

export function usePharmacyProductsListQuery(
    params: PharmacyProductsListParams,
) {
    return useQuery({
        queryKey: pharmacyProductsKeys.list(params),
        queryFn: () => fetchPharmacyProducts(params),
        staleTime: 10_000,
    });
}
