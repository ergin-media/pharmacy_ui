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

export function ProviderProductsMappingsPage() {
    const vm = useProviderProductsListPage();
    const { filters, query, meta, actions } = vm;

    const updateMapping = useUpdateProviderProductMapping();

    function openManageMapping(row: ProviderProductMapDto) {
        console.log(row);
    }

    async function removeMapping(row: ProviderProductMapDto) {
        await updateMapping.mutateAsync({
            id: row.id,
            pharmacy_product_id: null,
        });
        actions.refresh();
    }

    const disableControls = query.isFetching;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Mappings</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
                {query.isError ? (
                    <div className="flex items-center gap-2">
                        <div className="text-sm text-destructive">
                            Fehler:{" "}
                            {(query.error as Error)?.message ?? "unknown"}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={actions.refresh}
                        >
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

                        <ProviderProductsListTable
                            items={query.data?.items ?? []}
                            perPage={filters.perPage}
                            isLoading={query.isFetching}
                            onManageMapping={openManageMapping}
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
