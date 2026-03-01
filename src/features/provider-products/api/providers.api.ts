// src/features/provider-products/api/providers.api.ts
import { api } from "@/shared/api/axios";
import type { ProviderProductsProvidersResponseDto } from "../types/providers.dto";

export async function fetchProviderProductsProviders() {
    const res = await api.get<ProviderProductsProvidersResponseDto>(
        "provider-products/providers",
    );
    return res.data;
}
