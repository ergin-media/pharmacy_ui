import { useProviderProductsListPage } from "./useProviderProductsListPage";
import { useUpdateProviderProductMapping } from "../queries/providerProducts.queries";
import type { ProviderProductMapDto } from "../types/provider-products.dto";

export function useProviderProductsMappingsPage() {
    const vm = useProviderProductsListPage();
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

    async function removeMapping(row: ProviderProductMapDto) {
        await setMapping(row, null);
    }

    const disableControls = vm.query.isFetching;

    return {
        ...vm,
        disableControls,
        actions: {
            ...vm.actions,
            setMapping,
            removeMapping,
        },
    };
}
