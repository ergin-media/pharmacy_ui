import { useEffect, useState } from "react";

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
        label: "",
        quantity: 1,
        unit: "g",
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

    return {
        values,
        actions: {
            patch,
            updateItem,
            addItem,
            removeItem,
            setDocumentFile,
        },
    };
}