// src/features/provider-products/queries/providers.queries.ts
import { useQuery } from "@tanstack/react-query";
import { fetchProviderProductsProviders } from "../api/providers.api";

export function useProviderProductsProvidersQuery() {
    return useQuery({
        queryKey: ["provider-products", "providers"],
        queryFn: fetchProviderProductsProviders,
        staleTime: 5 * 60 * 1000,
    });
}
