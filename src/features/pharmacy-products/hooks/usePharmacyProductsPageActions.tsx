import { Trash2 } from "lucide-react";

import { useAppDialog } from "@/shared/ui/dialogs/appDialog.store";
import { useDeletePharmacyProductMutation } from "../delete-product/queries/pharmacy-product-delete.mutations";
import { usePharmacyProductPanels } from "./usePharmacyProductPanels";
import type { PharmacyProductDto } from "../types/pharmacy-products.dto";

export function usePharmacyProductsPageActions() {
    const panels = usePharmacyProductPanels();
    const { confirm } = useAppDialog();
    const deleteMutation = useDeletePharmacyProductMutation();

    const actions = {
        create: () => panels.create.open(),
        import: () => panels.import.open(),
        edit: (product: PharmacyProductDto) => panels.edit.open(product),
        remove: (product: PharmacyProductDto) => {
            confirm({
                title: "Artikel löschen",
                description: (
                    <>
                        Möchtest du den Artikel{" "}
                        <span className="font-medium text-foreground">
                            {product.name}
                        </span>{" "}
                        wirklich löschen?
                    </>
                ),
                icon: <Trash2 className="size-5" />,
                confirmLabel: "Löschen",
                cancelLabel: "Abbrechen",
                isDangerous: true,
                onConfirm: async () => {
                    await deleteMutation.mutateAsync(product.id);
                },
            });
        },
    };

    return {
        actions,
    };
}