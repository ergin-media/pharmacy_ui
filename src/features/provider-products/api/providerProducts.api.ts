import { api } from "@/shared/api/axios";
import type {
    ProviderProductsListParams,
    ProviderProductsListResponse,
} from "../types/provider-products.dto";

export async function fetchProviderProducts(
    params: ProviderProductsListParams,
) {
    const res = await api.get<ProviderProductsListResponse>(
        "provider-products",
        {
            params,
        },
    );

    return res.data;
}

export async function updateProviderProductMapping(input: {
    id: number;
    pharmacy_product_id: number | null;
}) {
    const res = await api.patch<{ ok: boolean; status: string }>(
        `provider-products/${input.id}`,
        { pharmacy_product_id: input.pharmacy_product_id },
    );

    return res.data;
}
