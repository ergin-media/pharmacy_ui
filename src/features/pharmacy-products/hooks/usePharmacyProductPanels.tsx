import { useCallback } from "react";

import { useSlideInPanel } from "@/shared/ui/slide-in-panel/slideInPanel.store";
import type { SlideInPanelRenderApi } from "@/shared/ui/slide-in-panel/slideInPanel.types";

import type { PharmacyProductDto } from "../types/pharmacy-products.dto";
import { PharmacyProductFormPanel } from "../product-form/components/PharmacyProductFormPanel";
import { PharmacyProductsImportPanel } from "../import/components/PharmacyProductsImportPanel";

export function usePharmacyProductPanels() {
    const { openPanel } = useSlideInPanel();

    const openCreate = useCallback(() => {
        openPanel({
            title: "Artikel erstellen",
            variant: "md",
            render: ({ close }: SlideInPanelRenderApi) => (
                <PharmacyProductFormPanel
                    onCancel={close}
                    onSaved={close}
                />
            ),
        });
    }, [openPanel]);

    const openEdit = useCallback(
        (product: PharmacyProductDto) => {
            openPanel({
                title: "Artikel bearbeiten",
                description: product.name,
                variant: "md",
                render: ({ close }: SlideInPanelRenderApi) => (
                    <PharmacyProductFormPanel
                        product={product}
                        onCancel={close}
                        onSaved={close}
                    />
                ),
            });
        },
        [openPanel],
    );

    const openImport = useCallback(() => {
        openPanel({
            title: "CSV Import",
            variant: "2xl",
            render: ({ close }) => (
                <PharmacyProductsImportPanel
                    onCancel={close}
                    onImported={close}
                />
            ),
        });
    }, [openPanel]);

    return {
        create: {
            open: openCreate,
        },
        edit: {
            open: openEdit,
        },
        import: {
            open: openImport,
        },
    };
}
