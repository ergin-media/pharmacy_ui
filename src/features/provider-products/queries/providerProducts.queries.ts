import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import type { ProviderProductsListParams } from "../types/provider-products.dto";
import {
    fetchProviderProducts,
    updateProviderProductMapping,
} from "../api/providerProducts.api";

export const providerProductsKeys = {
    all: ["provider-products"] as const,
    list: (params: ProviderProductsListParams) =>
        [...providerProductsKeys.all, "list", params] as const,
};

export function useProviderProductsListQuery(
    params: ProviderProductsListParams,
) {
    return useQuery({
        queryKey: providerProductsKeys.list(params),
        queryFn: () => fetchProviderProducts(params),
        placeholderData: keepPreviousData,
    });
}

export function useUpdateProviderProductMapping() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: updateProviderProductMapping,

        onSuccess: (data) => {
            const updatedItem = data.item;

            // 🔥 Alle ProviderProduct-Listen im Cache patchen
            qc.setQueriesData(
                { queryKey: providerProductsKeys.all },
                (old: any) => {
                    if (!old?.items) return old;

                    return {
                        ...old,
                        items: old.items.map((i: any) =>
                            i.id === updatedItem.id ? updatedItem : i
                        ),
                    };
                }
            );
        },
    });
}
