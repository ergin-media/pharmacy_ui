import { useState } from "react";
import { Trash2 } from "lucide-react";

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
            icon={<Trash2 className="size-5" />}
            confirmLabel="Löschen"
            cancelLabel="Abbrechen"
            isDangerous
            isLoading={isBusy}
            onConfirm={handleDelete}
        >
            Soll der Artikel{" "}
            <span className="font-medium text-foreground">
                {product?.name ?? "—"}
            </span>{" "}
            wirklich gelöscht werden?
            <div className="text-sm text-muted-foreground">
                Der Artikel ist danach nicht mehr aktiv auswählbar.
            </div>
        </ConfirmDialog>
    );
}