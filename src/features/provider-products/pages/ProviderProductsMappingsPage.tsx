import { ProviderProductsListTable } from "../components/ProviderProductsListTable";

import { Pagination } from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ProviderProductsMappingsToolbar } from "../components/ProviderProductsMappingsToolbar";
import {
    PER_PAGE_OPTIONS,
    type MappedTabValue,
} from "../lib/provider-products.constants";
import { useProviderProductsMappingsPage } from "../hooks/useProviderProductsMappingsPage";

export function ProviderProductsMappingsPage() {
    const vm = useProviderProductsMappingsPage();
    const {
        filters,
        query,
        meta,
        actions,
        pharmacyProducts,
        pharmacyProductsQuery,
        disableControls,
        busyRowIds,
    } = vm;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Mappings</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
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
                    disableControls={disableControls}
                    pharmacyProducts={pharmacyProducts}
                    pharmacyProductsLoading={pharmacyProductsQuery.isFetching}
                    onSetMapping={actions.setMapping}
                    onRemoveMapping={actions.removeMapping} // ✅ wieder da
                    busyRowIds={busyRowIds}
                />

                <Pagination
                    page={filters.page}
                    totalPages={meta.totalPages}
                    onPageChange={actions.setPage}
                    isLoading={query.isFetching}
                />
            </CardContent>
        </Card>
    );
}
