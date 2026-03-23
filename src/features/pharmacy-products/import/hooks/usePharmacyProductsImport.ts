import { useState } from "react";

import {
    previewPharmacyProductsImport,
    importPharmacyProductsCsv,
} from "../api/pharmacy-products-import.api";

import type {
    PharmacyProductsImportPreviewError,
    PharmacyProductsImportPreviewRow,
} from "../types/pharmacy-products-import.types";

export function usePharmacyProductsImport() {
    const [file, setFile] = useState<File | null>(null);

    const [columns, setColumns] = useState<string[]>([]);
    const [preview, setPreview] = useState<
        PharmacyProductsImportPreviewRow[]
    >([]);
    const [errors, setErrors] = useState<
        PharmacyProductsImportPreviewError[]
    >([]);

    const [summary, setSummary] = useState<{
        total_rows: number;
        valid_rows: number;
        invalid_rows: number;
    } | null>(null);

    const [isPreviewLoading, setIsPreviewLoading] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    const [previewError, setPreviewError] = useState<string | null>(null);
    const [importError, setImportError] = useState<string | null>(null);

    // -----------------------------
    // PREVIEW
    // -----------------------------
    async function handlePreview(nextFile: File) {
        setFile(nextFile);
        setIsPreviewLoading(true);

        setPreviewError(null);
        setImportError(null);

        try {
            const res = await previewPharmacyProductsImport(nextFile);

            setColumns(res.columns ?? []);
            setPreview(res.preview ?? []);
            setErrors(res.errors ?? []);
            setSummary(res.summary ?? null);
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "CSV-Vorschau konnte nicht geladen werden.";

            setColumns([]);
            setPreview([]);
            setErrors([]);
            setSummary(null);
            setPreviewError(message);
        } finally {
            setIsPreviewLoading(false);
        }
    }

    // -----------------------------
    // IMPORT
    // -----------------------------
    async function handleImport() {
        if (!file || isImporting) return null;

        setIsImporting(true);
        setImportError(null);

        try {
            const res = await importPharmacyProductsCsv(file);
            return res;
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "CSV-Import fehlgeschlagen.";

            setImportError(message);
            return null;
        } finally {
            setIsImporting(false);
        }
    }

    // -----------------------------
    // RESET
    // -----------------------------
    function reset() {
        setFile(null);
        setColumns([]);
        setPreview([]);
        setErrors([]);
        setSummary(null);
        setPreviewError(null);
        setImportError(null);
        setIsPreviewLoading(false);
        setIsImporting(false);
    }

    // -----------------------------
    // DERIVED STATE
    // -----------------------------
    const hasPreview =
        preview.length > 0 || columns.length > 0 || !!summary;

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