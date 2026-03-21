import { useEffect, useMemo, useState } from "react";

import { useDebouncedValue } from "@/shared/lib/hooks/useDebouncedValue";

import type { RxOfferFormValues } from "../types/rx.offer.types";
import { mapRxOfferFormToPreviewPayload } from "../lib/rx-offer.payload";
import { previewRxOfferPdf } from "../api/rx-offer.api";

function isOfferPreviewValid(values: RxOfferFormValues) {
    if (!values.issueDate) return false;
    if (!values.items.length) return false;

    return values.items.every((item) => {
        return (
            item.id != null &&
            item.label.trim().length > 0 &&
            item.quantity > 0 &&
            String(item.unit ?? "").trim().length > 0 &&
            item.unitPriceCents >= 0
        );
    });
}

export function useRxOfferPreview(values: RxOfferFormValues) {
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const previewPayload = useMemo(
        () => mapRxOfferFormToPreviewPayload(values),
        [values],
    );

    const debouncedPreviewPayload = useDebouncedValue(previewPayload, 400);

    const isValid = useMemo(() => isOfferPreviewValid(values), [values]);

    useEffect(() => {
        if (!isValid) {
            setError(null);
            setIsLoading(false);
            return;
        }

        let isCancelled = false;
        let nextBlobUrl: string | null = null;

        async function run() {
            setIsLoading(true);
            setError(null);

            try {
                const blob = await previewRxOfferPdf({
                    rxId: values.rxId,
                    payload: debouncedPreviewPayload,
                });

                if (isCancelled) return;

                nextBlobUrl = URL.createObjectURL(blob);

                setBlobUrl((prev) => {
                    if (prev) URL.revokeObjectURL(prev);
                    return nextBlobUrl;
                });

                setIsInitialized(true);
            } catch {
                if (isCancelled) return;
                setError("Vorschau konnte nicht geladen werden.");
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        }

        void run();

        return () => {
            isCancelled = true;
        };
    }, [debouncedPreviewPayload, isValid, values.rxId]);

    useEffect(() => {
        return () => {
            setBlobUrl((prev) => {
                if (prev) URL.revokeObjectURL(prev);
                return null;
            });
        };
    }, []);

    return {
        blobUrl,
        isLoading,
        isInitialized,
        isValid,
        error,
    };
}