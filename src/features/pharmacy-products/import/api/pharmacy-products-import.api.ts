import { api } from "@/shared/api/axios";

import type {
    PharmacyProductsImportPreviewResponse,
    PharmacyProductsImportResponse,
} from "../types/pharmacy-products-import.types";

type ApiErrorResponse = {
    ok: false;
    error?: {
        code?: string;
        message?: string;
        details?: unknown;
    };
};

function buildCsvFormData(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return formData;
}

function isApiErrorResponse(data: unknown): data is ApiErrorResponse {
    return (
        typeof data === "object" &&
        data !== null &&
        "ok" in data &&
        (data as { ok?: unknown }).ok === false
    );
}

function assertOk<T>(data: T | ApiErrorResponse): T {
    if (isApiErrorResponse(data)) {
        throw new Error(JSON.stringify(data));
    }

    return data as T;
}

async function postCsv<T>(url: string, file: File): Promise<T> {
    try {
        const { data } = await api.post<T | ApiErrorResponse>(
            `/${url}`,
            buildCsvFormData(file),
        );

        return assertOk(data);
    } catch (error: unknown) {
        const responseData = (error as { response?: { data?: unknown } })
            ?.response?.data;

        if (responseData) {
            throw new Error(JSON.stringify(responseData));
        }

        throw error;
    }
}

export async function previewPharmacyProductsImport(file: File) {
    return postCsv<PharmacyProductsImportPreviewResponse>(
        "pharmacy-products/import-preview",
        file,
    );
}

export async function importPharmacyProductsCsv(file: File) {
    return postCsv<PharmacyProductsImportResponse>(
        "pharmacy-products/import",
        file,
    );
}
