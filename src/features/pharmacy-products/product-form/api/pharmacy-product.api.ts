import { api } from "@/shared/api/axios";
import type { PharmacyProductDto } from "../../types/pharmacy-products.dto";
import type { PharmacyProductFormValues } from "../types/pharmacy-product-form.types";

export async function createPharmacyProduct(
    payload: PharmacyProductFormValues,
) {
    const res = await api.post<{
        item: PharmacyProductDto;
    }>("pharmacy-products/create", payload);

    return res.data;
}

export async function updatePharmacyProduct(
    payload: PharmacyProductFormValues,
) {
    const res = await api.put<{
        item: PharmacyProductDto;
    }>(`pharmacy-products/${payload.id}`, payload);

    return res.data;
}