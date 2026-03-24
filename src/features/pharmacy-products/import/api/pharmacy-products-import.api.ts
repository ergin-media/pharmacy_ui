import type {
    PharmacyProductsImportPreviewResponse,
    PharmacyProductsImportResponse,
} from "../types/pharmacy-products-import.types";

function buildCsvFormData(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return formData;
}

async function postCsv<T>(url: string, file: File): Promise<T> {
    const res = await fetch(`/v1/${url}`, {
        method: "POST",
        body: buildCsvFormData(file),
        credentials: "include",
    });

    const data = await res.json();

    if (!res.ok || data?.ok === false) {
        throw new Error(JSON.stringify(data));
    }

    return data as T;
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
