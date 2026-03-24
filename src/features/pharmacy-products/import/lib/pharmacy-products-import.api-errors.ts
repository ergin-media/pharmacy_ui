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

    missingColumns?: string[];
    foundColumns?: string[];

    unknownColumns?: string[];
    allowedColumns?: string[];
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

function extractMissingColumns(details: unknown) {
    if (!details || typeof details !== "object") {
        return { missing: [], found: [] };
    }

    const d = details as {
        missing?: unknown;
        field?: unknown;
        required_column?: unknown;
        columns_found?: unknown;
    };

    let missing: string[] = [];

    if (Array.isArray(d.missing)) {
        missing = d.missing.filter((v): v is string => typeof v === "string");
    } else if (typeof d.required_column === "string") {
        missing = [d.required_column];
    } else if (typeof d.field === "string") {
        missing = [d.field];
    }

    const found = Array.isArray(d.columns_found)
        ? d.columns_found.filter((v): v is string => typeof v === "string")
        : [];

    return { missing, found };
}

function extractUnknownColumns(details: unknown) {
    if (!details || typeof details !== "object") {
        return { unknown: [], allowed: [] };
    }

    const d = details as {
        unknown_columns?: unknown;
        allowed_columns?: unknown;
    };

    const unknown = Array.isArray(d.unknown_columns)
        ? d.unknown_columns.filter(
              (value): value is string => typeof value === "string",
          )
        : [];

    const allowed = Array.isArray(d.allowed_columns)
        ? d.allowed_columns.filter(
              (value): value is string => typeof value === "string",
          )
        : [];

    return { unknown, allowed };
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
            const { missing, found } = extractMissingColumns(details);

            return {
                code,
                message: rawMessage,
                validationErrors: [],
                missingColumns: missing,
                foundColumns: found,
            };
        }

        if (code === "csv_unknown_columns") {
            const { unknown, allowed } = extractUnknownColumns(details);

            return {
                code,
                message: rawMessage,
                validationErrors: [],
                unknownColumns: unknown,
                allowedColumns: allowed,
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
