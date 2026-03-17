import { useMemo } from "react";

import type { RxItem, RxListItemDto } from "../types/rx.dto";
import { rxItemHasMapping } from "../lib/rx.reparse";
import { useAssignRxMappingsMutation } from "../queries/rx.queries";

function getUnmappedItems(items?: RxItem[] | null) {
    return (items ?? []).filter((item) => !rxItemHasMapping(item));
}

export function useRxMissingMappings(rx: RxListItemDto) {
    const assignMappingsMutation = useAssignRxMappingsMutation();

    const unmappedItems = useMemo(() => getUnmappedItems(rx.items), [rx.items]);

    async function assignMappings(input: {
        rxDocumentId: number;
        mappings: Array<{
            rxItemId: number;
            providerProductMapId: number;
            pharmacyProductId: number | null;
        }>;
    }) {
        await assignMappingsMutation.mutateAsync({
            rx_document_id: input.rxDocumentId,
            mappings: input.mappings.map((m) => ({
                rx_item_id: m.rxItemId,
                provider_product_map_id: m.providerProductMapId,
                pharmacy_product_id: m.pharmacyProductId,
            })),
        });
    }

    return {
        unmappedItems,
        isSaving: assignMappingsMutation.isPending,
        actions: {
            assignMappings,
        },
    };
}
