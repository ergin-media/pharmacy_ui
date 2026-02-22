import { useUpdateProviderProductMapping } from "../queries/providerProducts.queries";
import { ProviderProductsListTable } from "../components/ProviderProductsListTable";
import type { ProviderProductMapDto } from "../types/provider-products.dto";

import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useProviderProductsListPage } from "../hooks/useProviderProductsListPage";
import { ProviderProductsMappingsToolbar } from "../components/ProviderProductsMappingsToolbar";
import {
    PER_PAGE_OPTIONS,
    type MappedTabValue,
} from "../lib/provider-products.constants";
import { usePharmacyProductsForMappingQuery } from "../queries/pharmacyProductsForMapping.queries";

export function ProviderProductsMappingsPage() {
    const vm = useProviderProductsListPage();
    const { filters, query, meta, actions } = vm;

    const pharmacyProductsQuery = usePharmacyProductsForMappingQuery();
    const pharmacyProducts = pharmacyProductsQuery.data?.items ?? [];

    const updateMapping = useUpdateProviderProductMapping();

    async function setMapping(row: ProviderProductMapDto, pharmacyProductId: number | null) {
        await updateMapping.mutateAsync({
            id: row.id,
            pharmacy_product_id: pharmacyProductId,
        });

        // Falls deine Mutation noch nicht sauber invalidated:
        actions.refresh();
    }

    async function removeMapping(row: ProviderProductMapDto) {
        await setMapping(row, null);
    }

    const disableControls =
        query.isFetching ||
        updateMapping.isPending ||
        pharmacyProductsQuery.isFetching;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Mappings</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
                {query.isError ? (
                    <div className="flex items-center gap-2">
                        <div className="text-sm text-destructive">
                            Fehler: {(query.error as Error)?.message ?? "unknown"}
                        </div>
                        <Button variant="outline" size="sm" onClick={actions.refresh}>
                            Erneut versuchen
                        </Button>
                    </div>
                ) : (
                    <>
                        <ProviderProductsMappingsToolbar
                            total={meta.total}
                            tabValue={filters.tabValue as MappedTabValue}
                            onTabChange={actions.setTabValue}
                            search={filters.searchInput}
                            onSearchChange={actions.setSearch}
                            page={filters.page}
                            totalPages={meta.totalPages}
                            onPageChange={actions.setPage}
                            perPage={filters.perPage}
                            perPageOptions={PER_PAGE_OPTIONS}
                            onPerPageChange={actions.setPerPage}
                            isLoading={query.isFetching}
                            disableControls={disableControls}
                        />

                        {/* Optional: nur Hinweis, wenn Produkte nicht geladen werden konnten */}
                        {pharmacyProductsQuery.isError ? (
                            <div className="text-sm text-destructive">
                                Konnte Produktliste nicht laden:{" "}
                                {(pharmacyProductsQuery.error as Error)?.message ?? "unknown"}
                            </div>
                        ) : null}

                        <ProviderProductsListTable
                            items={query.data?.items ?? []}
                            perPage={filters.perPage}
                            isLoading={query.isFetching}
                            disableControls={disableControls}
                            pharmacyProducts={pharmacyProducts}
                            pharmacyProductsLoading={pharmacyProductsQuery.isFetching}
                            onSetMapping={setMapping}
                            onRemoveMapping={removeMapping}
                        />

                        <Pagination
                            page={filters.page}
                            totalPages={meta.totalPages}
                            onPageChange={actions.setPage}
                            isLoading={query.isFetching}
                        />
                    </>
                )}
            </CardContent>
        </Card>
    );
}