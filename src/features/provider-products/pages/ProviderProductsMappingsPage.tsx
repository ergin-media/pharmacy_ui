// src/features/provider-products/pages/ProviderProductsMappingsPage.tsx
import { ProviderProductsListTable } from "../components/ProviderProductsListTable";

import { Pagination } from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ProviderProductsMappingsToolbar } from "../components/ProviderProductsMappingsToolbar";
import {
    PER_PAGE_OPTIONS,
    type MappedTabValue,
} from "../lib/provider-products.constants";

import { useProviderProductsMappingsPage } from "../hooks/useProviderProductsMappingsPage";
import { useProviderProductsProvidersQuery } from "../queries/providers.queries";
import { TypographyH1 } from "@/components/ui/typography";

export function ProviderProductsMappingsPage() {
    const vm = useProviderProductsMappingsPage();
    const providersQuery = useProviderProductsProvidersQuery();

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

    const providers = providersQuery.data?.items ?? [];

    return (
        <>
            <TypographyH1 className="mb-4">Mappings</TypographyH1>
            <Card>
                <CardContent className="grid gap-4">
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
                        // ✅ Provider Filter neu
                        providers={providers}
                        providerId={filters.providerId ?? null}
                        onProviderChange={(id) => actions.setProviderId(id)}
                    />

                    {/* Optional: Hinweis wenn Provider-Liste nicht geladen werden konnte */}
                    {providersQuery.isError ? (
                        <div className="rounded-xl border bg-white p-3 text-sm text-destructive">
                            Hinweis: Provider-Liste konnte nicht geladen werden.
                        </div>
                    ) : null}

                    <ProviderProductsListTable
                        items={query.data?.items ?? []}
                        perPage={filters.perPage}
                        isLoading={query.isFetching}
                        disableControls={disableControls}
                        pharmacyProducts={pharmacyProducts}
                        pharmacyProductsLoading={pharmacyProductsQuery.isFetching}
                        onSetMapping={actions.setMapping}
                        onRemoveMapping={actions.removeMapping}
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
        </>
    );
}
