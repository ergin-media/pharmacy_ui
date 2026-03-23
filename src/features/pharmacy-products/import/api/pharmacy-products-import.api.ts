import { api } from "@/shared/api/axios";
import type { PharmacyProductsImportPreviewResponse, PharmacyProductsImportResponse } from "../types/pharmacy-products-import.types";

export async function uploadPharmacyProductsCsv(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`/v1/pharmacy-products/import`, {
        method: "POST",
        body: formData,
        credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.error?.message ?? "Upload failed");
    }

    return data;
}

function buildCsvFormData(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return formData;
}

export async function previewPharmacyProductsImport(file: File) {
    const res = await api.post<PharmacyProductsImportPreviewResponse>(
        "pharmacy-products/import-preview",
        buildCsvFormData(file),
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        },
    );

    return res.data;
}

export async function importPharmacyProductsCsv(file: File) {
    const res = await api.post<PharmacyProductsImportResponse>(
        "pharmacy-products/import",
        buildCsvFormData(file),
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        },
    );

    return res.data;
}