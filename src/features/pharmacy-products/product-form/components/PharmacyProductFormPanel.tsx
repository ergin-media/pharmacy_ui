import { useState } from "react";

import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";

import type { PharmacyProductDto } from "../../types/pharmacy-products.dto";
import { usePharmacyProductForm } from "../hooks/usePharmacyProductForm";
import {
    useCreatePharmacyProductMutation,
    useUpdatePharmacyProductMutation,
} from "../queries/pharmacy-product.mutations";
import { PharmacyProductForm } from "./PharmacyProductForm";

export function PharmacyProductFormPanel(props: {
    product?: PharmacyProductDto | null;
    onCancel: () => void;
    onSaved: () => Promise<void> | void;
}) {
    const { product, onCancel, onSaved } = props;

    const form = usePharmacyProductForm({ product });

    const createMutation = useCreatePharmacyProductMutation();
    const updateMutation = useUpdatePharmacyProductMutation();

    const [isFinishing, setIsFinishing] = useState(false);

    const isEdit = Boolean(product?.id);

    const isBusy =
        createMutation.isPending ||
        updateMutation.isPending ||
        isFinishing;

    async function handleSubmit() {
        if (isBusy) return;

        setIsFinishing(true);

        try {
            if (isEdit) {
                await updateMutation.mutateAsync(form.values);
            } else {
                await createMutation.mutateAsync(form.values);
            }

            await onSaved();
        } finally {
            setIsFinishing(false);
        }
    }

    return (
        <div className="flex h-full min-h-0 flex-col">
            <div className="flex-1 overflow-auto">
                <PharmacyProductForm
                    values={form.values}
                    onChange={form.actions.patch}
                />
            </div>

            <div className="sticky bottom-0 px-4 py-3">
                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        disabled={isBusy}
                    >
                        Abbrechen
                    </Button>

                    <LoadingButton loading={isBusy} onClick={handleSubmit}>
                        {isEdit ? "Speichern" : "Artikel erstellen"}
                    </LoadingButton>
                </div>
            </div>
        </div>
    );
}