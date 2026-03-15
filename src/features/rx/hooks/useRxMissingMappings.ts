import { useMemo } from "react";

import { usePharmacyProductsForMappingQuery } from "@/features/provider-products/queries/pharmacyProductsForMapping.queries";

import type { RxItem, RxListItemDto } from "../types/rx.dto";
import { rxItemHasMapping } from "../lib/rx.reparse";

function getUnmappedItems(items?: RxItem[] | null) {
    return (items ?? []).filter((item) => !rxItemHasMapping(item));
}

export function useRxMissingMappings(rx: RxListItemDto) {
    const pharmacyProductsQuery = usePharmacyProductsForMappingQuery();
    const pharmacyProducts = pharmacyProductsQuery.data?.items ?? [];

    const unmappedItems = useMemo(
        () => getUnmappedItems(rx.items),
        [rx.items],
    );

    async function assignMapping(input: {
        rxItemId: number;
        providerProductMapId: number;
        pharmacyProductId: number | null;
    }) {
        // folgt im nächsten Schritt über RX-Mutation
        console.log("assignMapping", input);
    }

    return {
        unmappedItems,
        pharmacyProducts,
        pharmacyProductsQuery,
        isLoadingProducts: pharmacyProductsQuery.isFetching,
        actions: {
            assignMapping,
        },
    };
}