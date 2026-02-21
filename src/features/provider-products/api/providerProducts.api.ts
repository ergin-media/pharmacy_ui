import type {
    ProviderProductsListParams,
    ProviderProductsListResponse,
} from "../types/provider-products.dto";
import { api } from "@/shared/api/axios"; // <- so wie du es im Rx Feature machst (falls vorhanden)

export async function fetchProviderProducts(
    params: ProviderProductsListParams,
) {
    const res = await api.get<ProviderProductsListResponse>(
        "/v1/provider-products",
        {
            params: {
                page: params.page,
                per_page: params.per_page,
                sort: params.sort,
                search: params.search,
                ...(params.mapped ? { mapped: params.mapped } : {}),
            },
        },
    );
    return res.data;
}

export async function updateProviderProductMapping(input: {
    id: number;
    pharmacy_product_id: number | null;
}) {
    const res = await api.patch<{ ok: boolean; status: string }>(
        `/v1/provider-products/${input.id}`,
        { pharmacy_product_id: input.pharmacy_product_id },
    );
    return res.data;
}
