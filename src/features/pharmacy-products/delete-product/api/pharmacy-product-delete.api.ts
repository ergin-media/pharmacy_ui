import { api } from "@/shared/api/axios";

export type DeletePharmacyProductResponse = {
    ok: true;
};

export async function deletePharmacyProduct(id: number) {
    const res = await api.delete<DeletePharmacyProductResponse>(
        `pharmacy-products/${id}`,
    );

    return res.data;
}