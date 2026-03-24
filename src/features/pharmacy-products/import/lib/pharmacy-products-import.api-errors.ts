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

    const typedDetails = details as {
        missing?: unknown;
        field?: unknown;
        required_column?: unknown;
        columns_found?: unknown;
    };

    let missingLabel: string | null = null;

    if (
        Array.isArray(typedDetails.missing) &&
        typedDetails.missing.length > 0
    ) {
        missingLabel = typedDetails.missing.join(", ");
    } else if (
        typeof typedDetails.required_column === "string" &&
        typedDetails.required_column.trim() !== ""
    ) {
        missingLabel = typedDetails.required_column;
    } else if (
        typeof typedDetails.field === "string" &&
        typedDetails.field.trim() !== ""
    ) {
        missingLabel = typedDetails.field;
    }

    const foundColumns = Array.isArray(typedDetails.columns_found)
        ? typedDetails.columns_found.filter(
              (value): value is string =>
                  typeof value === "string" && value.trim() !== "",
          )
        : [];

    if (missingLabel && foundColumns.length > 0) {
        return `Pflichtspalte fehlt: ${missingLabel}. Gefundene Spalten: ${foundColumns.join(", ")}`;
    }

    if (missingLabel) {
        return `Pflichtspalte fehlt: ${missingLabel}`;
    }

    return "Pflichtspalte fehlt";
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
