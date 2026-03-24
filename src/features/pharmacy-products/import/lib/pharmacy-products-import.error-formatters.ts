import type { PharmacyProductsImportPreviewError } from "../types/pharmacy-products-import.types";

const FIELD_LABELS: Record<string, string> = {
    name: "Produktname",
    manufacturer: "Hersteller",
    strain: "Strain",
    product_code: "Produktcode",
    base_price_cents: "Basispreis",
    price_other_provider_cents: "Preis für andere Provider",
    currency: "Währung",
};

export function getImportErrorFieldLabel(field?: string | null) {
    if (!field) return null;
    return FIELD_LABELS[field] ?? field;
}

export function formatImportErrorHeadline(
    error: PharmacyProductsImportPreviewError,
) {
    const fieldLabel = getImportErrorFieldLabel(error.field);

    if (!fieldLabel) {
        return `Zeile ${error.row}`;
    }

    return `Zeile ${error.row} · ${fieldLabel}`;
}
