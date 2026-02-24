import { useProviderProductsListPage } from "./useProviderProductsListPage";
import { useUpdateProviderProductMapping } from "../queries/providerProducts.queries";
import { usePharmacyProductsForMappingQuery } from "../queries/pharmacyProductsForMapping.queries";
import type { ProviderProductMapDto } from "../types/provider-products.dto";

export function useProviderProductsMappingsPage() {
    const vm = useProviderProductsListPage();

    const pharmacyProductsQuery = usePharmacyProductsForMappingQuery();
    const pharmacyProducts = pharmacyProductsQuery.data?.items ?? [];

    const updateMapping = useUpdateProviderProductMapping();

    async function setMapping(
        row: ProviderProductMapDto,
        pharmacyProductId: number | null,
    ) {
        await vm.actions.runRowAction(row.id, () =>
            updateMapping.mutateAsync({
                id: row.id,
                pharmacy_product_id: pharmacyProductId,
            }),
        );
    }

    // ✅ ursprüngliche Funktion – jetzt sauber im VM-Hook
    async function removeMapping(row: ProviderProductMapDto) {
        await setMapping(row, null);
    }

    const disableControls =
        vm.query.isFetching || pharmacyProductsQuery.isFetching;

    return {
        ...vm,
        pharmacyProductsQuery,
        pharmacyProducts,
        disableControls,
        actions: {
            ...vm.actions,
            setMapping,
            removeMapping, // ✅ hier zurückgeben
        },
    };
}
