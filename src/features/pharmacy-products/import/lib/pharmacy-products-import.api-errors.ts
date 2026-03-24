import type { PharmacyProductsImportPreviewError } from "../types/pharmacy-products-import.types";

type ImportApiErrorResponse = {
    ok: false;
    error?: {
        code?: string;
        message?: string;
        details?: unknown;
    };
};

export type ParsedPharmacyProductsImportError = {
    code: string;
    message: string;
    validationErrors: PharmacyProductsImportPreviewError[];
};

function isValidationErrorArray(
    value: unknown,
): value is PharmacyProductsImportPreviewError[] {
    return (
        Array.isArray(value) &&
        value.every(
            (item) =>
                item &&
                typeof item === "object" &&
                typeof item.row === "number" &&
                typeof item.message === "string",
        )
    );
}

function formatMissingColumns(details: unknown) {
    if (!details || typeof details !== "object") {
        return "Pflichtspalte fehlt";
    }

    const missing = (details as { missing?: unknown }).missing;

    if (!Array.isArray(missing) || missing.length === 0) {
        return "Pflichtspalte fehlt";
    }

    return `Pflichtspalte fehlt: ${missing.join(", ")}`;
}

export function parsePharmacyProductsImportError(
    error: unknown,
): ParsedPharmacyProductsImportError {
    const fallback: ParsedPharmacyProductsImportError = {
        code: "unknown_error",
        message: "Ein unbekannter Fehler ist aufgetreten.",
        validationErrors: [],
    };

    if (!(error instanceof Error)) {
        return fallback;
    }

    try {
        const parsed = JSON.parse(error.message) as ImportApiErrorResponse;
        const code = parsed.error?.code ?? "unknown_error";
        const rawMessage =
            parsed.error?.message ?? "Ein unbekannter Fehler ist aufgetreten.";
        const details = parsed.error?.details;

        if (code === "csv_validation_failed") {
            return {
                code,
                message: rawMessage,
                validationErrors: isValidationErrorArray(details)
                    ? details
                    : [],
            };
        }

        if (code === "csv_missing_column") {
            return {
                code,
                message: formatMissingColumns(details),
                validationErrors: [],
            };
        }

        return {
            code,
            message: rawMessage,
            validationErrors: [],
        };
    } catch {
        return {
            code: "unknown_error",
            message: error.message || "Ein unbekannter Fehler ist aufgetreten.",
            validationErrors: [],
        };
    }
}
