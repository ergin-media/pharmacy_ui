import { useState } from "react";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";

import type { PharmacyProductDto } from "../../types/pharmacy-products.dto";
import { useDeletePharmacyProductMutation } from "../queries/pharmacy-product-delete.mutations";

export function PharmacyProductDeleteDialog(props: {
    product: PharmacyProductDto | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const { product, open, onOpenChange } = props;

    const deleteMutation = useDeletePharmacyProductMutation();
    const [isFinishing, setIsFinishing] = useState(false);

    const isBusy = deleteMutation.isPending || isFinishing;

    async function handleDelete() {
        if (!product || isBusy) return;

        setIsFinishing(true);

        try {
            await deleteMutation.mutateAsync(product.id);
            onOpenChange(false);
        } finally {
            setIsFinishing(false);
        }
    }

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Artikel löschen"
            description={
                <>
                    Möchtest du den Artikel{" "}
                    <span className="font-medium text-foreground">
                        {product?.name ?? "—"}
                    </span>{" "}
                    wirklich löschen?
                </>
            }
            confirmLabel="Löschen"
            cancelLabel="Abbrechen"
            confirmVariant="destructive"
            isLoading={isBusy}
            onConfirm={handleDelete}
        />
    );
}