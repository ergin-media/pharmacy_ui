import { useProviderProductsListVm } from "../hooks/useProviderProductsListVm";
import {
    useProviderProductsListQuery,
    useUpdateProviderProductMapping,
} from "../queries/providerProducts.queries";
import { ProviderProductsListTable } from "../components/ProviderProductsListTable";

import { MAPPED_TABS } from "../lib/providerProducts.filters";

import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProviderProductMapDto } from "../types/provider-products.dto";
import { Pagination } from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProviderProductsMappingsPage() {
    const vm = useProviderProductsListVm();
    const { state, actions } = vm;

    const list = useProviderProductsListQuery({
        page: state.page,
        per_page: state.perPage,
        mapped: state.mapped || undefined,
        search: state.search || undefined,
        sort: state.sort,
    });

    const updateMapping = useUpdateProviderProductMapping();

    function openManageMapping(row: ProviderProductMapDto) {
        console.log(row);
    }

    async function removeMapping(row: ProviderProductMapDto) {
        await updateMapping.mutateAsync({
            id: row.id,
            pharmacy_product_id: null,
        });
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Mappings</CardTitle>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Tabs
                        value={state.tabValue}
                        onValueChange={(v) => actions.setTabValue(v)}
                    >
                        <TabsList className="flex flex-wrap">
                            {MAPPED_TABS.map((t) => (
                                <TabsTrigger key={t.value} value={t.value}>
                                    {t.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>

                    <div className="w-full sm:w-96">
                        <Input
                            value={state.search}
                            onChange={(e) => actions.setSearch(e.target.value)}
                            placeholder="Suche (externer Name)…"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <ProviderProductsListTable
                    items={list.data?.items ?? []}
                    perPage={state.perPage}
                    isLoading={list.isFetching}
                    onManageMapping={openManageMapping}
                    onRemoveMapping={removeMapping}
                />
                <Pagination
                    page={list.data?.page ?? state.page}
                    totalPages={list.data?.total_pages ?? 1}
                    onPageChange={actions.setPage}
                    isLoading={list.isFetching}
                />
            </CardContent>
        </Card>
    );
}
