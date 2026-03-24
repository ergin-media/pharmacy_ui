import { useState } from "react";

import {
    previewPharmacyProductsImport,
    importPharmacyProductsCsv,
} from "../api/pharmacy-products-import.api";

import type {
    PharmacyProductsImportPreviewError,
    PharmacyProductsImportPreviewRow,
} from "../types/pharmacy-products-import.types";
import { parsePharmacyProductsImportError } from "../lib/pharmacy-products-import.api-errors";

export function usePharmacyProductsImport() {
    const [file, setFile] = useState<File | null>(null);

    const [columns, setColumns] = useState<string[]>([]);
    const [preview, setPreview] = useState<PharmacyProductsImportPreviewRow[]>(
        [],
    );
    const [errors, setErrors] = useState<PharmacyProductsImportPreviewError[]>(
        [],
    );

    const [missingColumns, setMissingColumns] = useState<string[]>([]);
    const [foundColumns, setFoundColumns] = useState<string[]>([]);

    const [summary, setSummary] = useState<{
        total_rows: number;
        valid_rows: number;
        invalid_rows: number;
    } | null>(null);

    const [isPreviewLoading, setIsPreviewLoading] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    const [previewError, setPreviewError] = useState<string | null>(null);
    const [importError, setImportError] = useState<string | null>(null);

    async function handlePreview(nextFile: File) {
        setFile(nextFile);
        setIsPreviewLoading(true);

        setPreviewError(null);
        setImportError(null);
        setMissingColumns([]);
        setFoundColumns([]);

        try {
            const res = await previewPharmacyProductsImport(nextFile);

            setColumns(res.columns ?? []);
            setPreview(res.preview ?? []);
            setErrors(res.errors ?? []);
            setSummary(res.summary ?? null);
            setMissingColumns([]);
            setFoundColumns([]);
        } catch (err) {
            const parsed = parsePharmacyProductsImportError(err);

            setColumns([]);
            setPreview([]);
            setSummary(null);

            if (parsed.code === "csv_validation_failed") {
                setErrors(parsed.validationErrors);
                setPreviewError(parsed.message);
                setMissingColumns([]);
                setFoundColumns([]);
            } else if (parsed.code === "csv_missing_column") {
                setErrors([]);
                setPreviewError(parsed.message);
                setMissingColumns(parsed.missingColumns ?? []);
                setFoundColumns(parsed.foundColumns ?? []);
            } else {
                setErrors([]);
                setPreviewError(parsed.message);
                setMissingColumns([]);
                setFoundColumns([]);
            }
        } finally {
            setIsPreviewLoading(false);
        }
    }

    async function handleImport() {
        if (!file || isImporting) return null;

        setIsImporting(true);
        setImportError(null);

        try {
            const res = await importPharmacyProductsCsv(file);
            return res;
        } catch (err) {
            const parsed = parsePharmacyProductsImportError(err);

            if (parsed.code === "csv_validation_failed") {
                setErrors(parsed.validationErrors);
                setMissingColumns([]);
                setFoundColumns([]);
            } else if (parsed.code === "csv_missing_column") {
                setMissingColumns(parsed.missingColumns ?? []);
                setFoundColumns(parsed.foundColumns ?? []);
            }

            setImportError(parsed.message);
            return null;
        } finally {
            setIsImporting(false);
        }
    }

    function reset() {
        setFile(null);
        setColumns([]);
        setPreview([]);
        setErrors([]);
        setMissingColumns([]);
        setFoundColumns([]);
        setSummary(null);
        setPreviewError(null);
        setImportError(null);
        setIsPreviewLoading(false);
        setIsImporting(false);
    }

    const hasPreview = preview.length > 0 || columns.length > 0 || !!summary;

    const canImport =
        !!file &&
        !isPreviewLoading &&
        !isImporting &&
        !!summary &&
        summary.valid_rows > 0;

    return {
        file,
        columns,
        preview,
        errors,
        missingColumns,
        foundColumns,
        summary,
        isPreviewLoading,
        isImporting,
        previewError,
        importError,
        hasPreview,
        canImport,
        actions: {
            preview: handlePreview,
            import: handleImport,
            reset,
        },
    };
}
