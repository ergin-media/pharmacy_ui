import { useMemo, useReducer } from "react";

import {
    previewPharmacyProductsImport,
    importPharmacyProductsCsv,
} from "../api/pharmacy-products-import.api";

import type {
    PharmacyProductsImportPreviewError,
    PharmacyProductsImportPreviewRow,
} from "../types/pharmacy-products-import.types";
import {
    parsePharmacyProductsImportError,
    type ParsedPharmacyProductsImportError,
} from "../lib/pharmacy-products-import.api-errors";

type ImportSummary = {
    total_rows: number;
    valid_rows: number;
    invalid_rows: number;
};

type State = {
    file: File | null;

    columns: string[];
    preview: PharmacyProductsImportPreviewRow[];
    errors: PharmacyProductsImportPreviewError[];

    missingColumns: string[];
    foundColumns: string[];
    unknownColumns: string[];
    allowedColumns: string[];

    summary: ImportSummary | null;

    isPreviewLoading: boolean;
    isImporting: boolean;

    previewError: string | null;
    importError: string | null;
};

type Action =
    | { type: "PREVIEW_START"; file: File }
    | {
          type: "PREVIEW_SUCCESS";
          payload: {
              columns: string[];
              preview: PharmacyProductsImportPreviewRow[];
              errors: PharmacyProductsImportPreviewError[];
              summary: ImportSummary | null;
          };
      }
    | {
          type: "PREVIEW_FAILURE";
          payload: ParsedPharmacyProductsImportError;
      }
    | { type: "IMPORT_START" }
    | {
          type: "IMPORT_FAILURE";
          payload: ParsedPharmacyProductsImportError;
      }
    | { type: "RESET" };

const initialState: State = {
    file: null,

    columns: [],
    preview: [],
    errors: [],

    missingColumns: [],
    foundColumns: [],
    unknownColumns: [],
    allowedColumns: [],

    summary: null,

    isPreviewLoading: false,
    isImporting: false,

    previewError: null,
    importError: null,
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "PREVIEW_START":
            return {
                ...state,
                file: action.file,
                isPreviewLoading: true,

                previewError: null,
                importError: null,

                columns: [],
                preview: [],
                errors: [],

                missingColumns: [],
                foundColumns: [],
                unknownColumns: [],
                allowedColumns: [],

                summary: null,
            };

        case "PREVIEW_SUCCESS":
            return {
                ...state,
                isPreviewLoading: false,

                columns: action.payload.columns,
                preview: action.payload.preview,
                errors: action.payload.errors,
                summary: action.payload.summary,

                previewError: null,

                missingColumns: [],
                foundColumns: [],
                unknownColumns: [],
                allowedColumns: [],
            };

        case "PREVIEW_FAILURE": {
            const parsed = action.payload;

            if (parsed.code === "csv_validation_failed") {
                return {
                    ...state,
                    isPreviewLoading: false,

                    columns: [],
                    preview: [],
                    summary: null,

                    errors: parsed.validationErrors,
                    previewError: parsed.message,

                    missingColumns: [],
                    foundColumns: [],
                    unknownColumns: [],
                    allowedColumns: [],
                };
            }

            if (parsed.code === "csv_missing_column") {
                return {
                    ...state,
                    isPreviewLoading: false,

                    columns: [],
                    preview: [],
                    summary: null,

                    errors: [],
                    previewError: parsed.message,

                    missingColumns: parsed.missingColumns ?? [],
                    foundColumns: parsed.foundColumns ?? [],
                    unknownColumns: [],
                    allowedColumns: [],
                };
            }

            if (parsed.code === "csv_unknown_columns") {
                return {
                    ...state,
                    isPreviewLoading: false,

                    columns: [],
                    preview: [],
                    summary: null,

                    errors: [],
                    previewError: parsed.message,

                    missingColumns: [],
                    foundColumns: [],
                    unknownColumns: parsed.unknownColumns ?? [],
                    allowedColumns: parsed.allowedColumns ?? [],
                };
            }

            return {
                ...state,
                isPreviewLoading: false,

                columns: [],
                preview: [],
                summary: null,

                errors: [],
                previewError: parsed.message,

                missingColumns: [],
                foundColumns: [],
                unknownColumns: [],
                allowedColumns: [],
            };
        }

        case "IMPORT_START":
            return {
                ...state,
                isImporting: true,
                importError: null,
            };

        case "IMPORT_FAILURE": {
            const parsed = action.payload;

            if (parsed.code === "csv_validation_failed") {
                return {
                    ...state,
                    isImporting: false,
                    importError: parsed.message,

                    errors: parsed.validationErrors,

                    missingColumns: [],
                    foundColumns: [],
                    unknownColumns: [],
                    allowedColumns: [],
                };
            }

            if (parsed.code === "csv_missing_column") {
                return {
                    ...state,
                    isImporting: false,
                    importError: parsed.message,

                    errors: [],
                    missingColumns: parsed.missingColumns ?? [],
                    foundColumns: parsed.foundColumns ?? [],
                    unknownColumns: [],
                    allowedColumns: [],
                };
            }

            if (parsed.code === "csv_unknown_columns") {
                return {
                    ...state,
                    isImporting: false,
                    importError: parsed.message,

                    errors: [],
                    missingColumns: [],
                    foundColumns: [],
                    unknownColumns: parsed.unknownColumns ?? [],
                    allowedColumns: parsed.allowedColumns ?? [],
                };
            }

            return {
                ...state,
                isImporting: false,
                importError: parsed.message,
            };
        }

        case "RESET":
            return initialState;

        default:
            return state;
    }
}

export function usePharmacyProductsImport() {
    const [state, dispatch] = useReducer(reducer, initialState);

    async function handlePreview(nextFile: File) {
        dispatch({ type: "PREVIEW_START", file: nextFile });

        try {
            const res = await previewPharmacyProductsImport(nextFile);

            dispatch({
                type: "PREVIEW_SUCCESS",
                payload: {
                    columns: res.columns ?? [],
                    preview: res.preview ?? [],
                    errors: res.errors ?? [],
                    summary: res.summary ?? null,
                },
            });
        } catch (err) {
            dispatch({
                type: "PREVIEW_FAILURE",
                payload: parsePharmacyProductsImportError(err),
            });
        }
    }

    async function handleImport() {
        if (!state.file || state.isImporting) return null;

        dispatch({ type: "IMPORT_START" });

        try {
            const res = await importPharmacyProductsCsv(state.file);
            return res;
        } catch (err) {
            dispatch({
                type: "IMPORT_FAILURE",
                payload: parsePharmacyProductsImportError(err),
            });
            return null;
        }
    }

    function reset() {
        dispatch({ type: "RESET" });
    }

    const hasPreview = useMemo(
        () =>
            state.preview.length > 0 ||
            state.columns.length > 0 ||
            !!state.summary,
        [state.preview.length, state.columns.length, state.summary],
    );

    const canImport = useMemo(
        () =>
            !!state.file &&
            !state.isPreviewLoading &&
            !state.isImporting &&
            !!state.summary &&
            state.summary.valid_rows > 0,
        [state.file, state.isPreviewLoading, state.isImporting, state.summary],
    );

    return {
        file: state.file,
        columns: state.columns,
        preview: state.preview,
        errors: state.errors,
        missingColumns: state.missingColumns,
        foundColumns: state.foundColumns,
        unknownColumns: state.unknownColumns,
        allowedColumns: state.allowedColumns,
        summary: state.summary,
        isPreviewLoading: state.isPreviewLoading,
        isImporting: state.isImporting,
        previewError: state.previewError,
        importError: state.importError,
        hasPreview,
        canImport,
        actions: {
            preview: handlePreview,
            import: handleImport,
            reset,
        },
    };
}
