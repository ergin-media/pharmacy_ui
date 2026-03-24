import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useSlideInPanel } from "@/shared/ui/slide-in-panel/slideInPanel.store";
import type { SlideInPanelRenderApi } from "@/shared/ui/slide-in-panel/slideInPanel.types";

import { pharmacyProductsKeys } from "../queries/pharmacy-products.queries";
import type { PharmacyProductDto } from "../types/pharmacy-products.dto";
import { PharmacyProductFormPanel } from "../product-form/components/PharmacyProductFormPanel";
import { PharmacyProductsImportPanel } from "../import/components/PharmacyProductsImportPanel";

export function usePharmacyProductPanels() {
    const { openPanel } = useSlideInPanel();
    const queryClient = useQueryClient();

    const openCreate = useCallback(() => {
        openPanel({
            title: "Artikel erstellen",
            variant: "md",
            render: ({ close }: SlideInPanelRenderApi) => (
                <PharmacyProductFormPanel
                    onCancel={close}
                    onSaved={async () => {
                        await queryClient.invalidateQueries({
                            queryKey: pharmacyProductsKeys.all,
                        });
                        close();
                    }}
                />
            ),
        });
    }, [openPanel, queryClient]);

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
                        onSaved={async () => {
                            await queryClient.invalidateQueries({
                                queryKey: pharmacyProductsKeys.all,
                            });
                            close();
                        }}
                    />
                ),
            });
        },
        [openPanel, queryClient],
    );

    const openImport = useCallback(() => {
        openPanel({
            title: "CSV Import",
            variant: "2xl",
            render: ({ close }) => (
                <PharmacyProductsImportPanel
                    onCancel={close}
                    onImported={async () => {
                        await queryClient.invalidateQueries({
                            queryKey: pharmacyProductsKeys.all,
                        });
                        close();
                    }}
                />
            ),
        });
    }, [openPanel, queryClient]);

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
