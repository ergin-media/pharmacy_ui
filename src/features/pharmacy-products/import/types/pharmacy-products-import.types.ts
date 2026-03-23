export type PharmacyProductsImportPreviewError = {
    row: number;
    field?: string | null;
    message: string;
};

export type PharmacyProductsImportPreviewRow = {
    row: number;
    values: Record<string, string | number | null>;
};

export type PharmacyProductsImportPreviewResponse = {
    ok: true;
    summary: {
        total_rows: number;
        valid_rows: number;
        invalid_rows: number;
    };
    columns: string[];
    preview: PharmacyProductsImportPreviewRow[];
    errors: PharmacyProductsImportPreviewError[];
};

export type PharmacyProductsImportResponse = {
    ok: true;
    summary: {
        total_rows: number;
        imported_rows: number;
        skipped_rows: number;
    };
    errors?: PharmacyProductsImportPreviewError[];
};