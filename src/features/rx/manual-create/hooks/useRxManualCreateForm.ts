import { useEffect, useMemo, useState } from "react";

import type { RxItem } from "../../types/rx.dto";
import type {
    RxManualCreateFormValues,
    RxManualCreateItem,
} from "../types/rx-manual-create.types";

function toDateInputValue(value?: string | null) {
    if (!value) return "";
    return String(value).slice(0, 10);
}

function createEmptyItem(nextId: number): RxManualCreateItem {
    return {
        id: nextId,
        pharmacyProductId: null,
        quantity: 1,
        unit: "g" as NonNullable<RxItem["unit"]>,
    };
}

export function useRxManualCreateForm() {
    const [values, setValues] = useState<RxManualCreateFormValues>({
        issueDate: toDateInputValue(new Date().toISOString()),

        patientFirstName: "",
        patientLastName: "",
        patientStreet: "",
        patientZip: "",
        patientCity: "",

        notes: "",

        items: [createEmptyItem(1)],

        documentFile: null,
        documentPreviewUrl: null,
        documentMimeType: null,
    });

    useEffect(() => {
        return () => {
            if (values.documentPreviewUrl) {
                URL.revokeObjectURL(values.documentPreviewUrl);
            }
        };
    }, [values.documentPreviewUrl]);

    function patch<K extends keyof RxManualCreateFormValues>(
        key: K,
        value: RxManualCreateFormValues[K],
    ) {
        setValues((prev) => ({
            ...prev,
            [key]: value,
        }));
    }

    function updateItem(
        itemId: number,
        patchData: Partial<RxManualCreateItem>,
    ) {
        setValues((prev) => ({
            ...prev,
            items: prev.items.map((item) =>
                item.id === itemId ? { ...item, ...patchData } : item,
            ),
        }));
    }

    function addItem() {
        setValues((prev) => {
            const maxId = prev.items.reduce(
                (acc, item) => Math.max(acc, item.id),
                0,
            );

            return {
                ...prev,
                items: [...prev.items, createEmptyItem(maxId + 1)],
            };
        });
    }

    function removeItem(itemId: number) {
        setValues((prev) => {
            if (prev.items.length <= 1) return prev;

            return {
                ...prev,
                items: prev.items.filter((item) => item.id !== itemId),
            };
        });
    }

    function setDocumentFile(file: File | null) {
        setValues((prev) => {
            if (prev.documentPreviewUrl) {
                URL.revokeObjectURL(prev.documentPreviewUrl);
            }

            if (!file) {
                return {
                    ...prev,
                    documentFile: null,
                    documentPreviewUrl: null,
                    documentMimeType: null,
                };
            }

            return {
                ...prev,
                documentFile: file,
                documentPreviewUrl: URL.createObjectURL(file),
                documentMimeType: file.type || null,
            };
        });
    }

    const canSubmit = useMemo(() => {
        const hasPatient =
            values.patientFirstName.trim() !== "" &&
            values.patientLastName.trim() !== "";

        const hasDocument = Boolean(values.documentFile);

        const hasValidItems =
            values.items.length > 0 &&
            values.items.every(
                (item) =>
                    item.pharmacyProductId != null &&
                    Number(item.quantity) > 0 &&
                    String(item.unit).trim() !== "",
            );

        return hasPatient && hasDocument && hasValidItems;
    }, [
        values.documentFile,
        values.items,
        values.patientFirstName,
        values.patientLastName,
    ]);

    return {
        values,
        meta: {
            canSubmit,
        },
        actions: {
            patch,
            updateItem,
            addItem,
            removeItem,
            setDocumentFile,
        },
    };
}
