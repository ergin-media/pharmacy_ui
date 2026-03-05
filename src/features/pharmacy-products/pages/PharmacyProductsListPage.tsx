import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { usePharmacyProductsListPage } from "../hooks/usePharmacyProductsListPage";
import { PharmacyProductsToolbar } from "../components/PharmacyProductsToolbar";
import { PharmacyProductsListTable } from "../components/PharmacyProductsListTable";
import { Pagination } from "@/components/ui/pagination";
import { TypographyH1 } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";

export function PharmacyProductsListPage() {
    const vm = usePharmacyProductsListPage();

    return (
        <div className="h-full w-full">
            <TypographyH1 className="mb-4">Produkte</TypographyH1>
            <Card>
                <CardContent className="space-y-3">
                    {vm.query.isError ? (
                        <div className="flex items-center gap-2">
                            <div className="text-sm text-destructive">
                                Fehler:{" "}
                                {(vm.query.error as Error)?.message ??
                                    "unknown"}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={vm.actions.refresh}
                            >
                                Erneut versuchen
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-1 items-center gap-4">
                                <div className="text-sm text-muted-foreground">
                                    Gesamt:{" "}
                                    <span className="font-medium text-foreground">
                                        {vm.meta.total}
                                    </span>
                                </div>

                                <Separator
                                    orientation="vertical"
                                    className="h-4"
                                />

                                <PharmacyProductsToolbar
                                    activeRaw={vm.filters.activeRaw}
                                    manufacturerRaw={vm.filters.manufacturerRaw}
                                    searchRaw={vm.filters.searchRaw}
                                    sort={vm.filters.sort ?? "created_at_desc"}
                                    perPage={vm.filters.perPage}
                                    isFetching={vm.query.isFetching}
                                    onActiveChange={vm.actions.setActive}
                                    onManufacturerChange={
                                        vm.actions.setManufacturer
                                    }
                                    onSearchChange={vm.actions.setSearch}
                                    onSortChange={vm.actions.setSort}
                                    onPerPageChange={vm.actions.setPerPage}
                                    onRefresh={vm.actions.refresh}
                                />

                                <Pagination
                                    page={vm.filters.page}
                                    totalPages={vm.meta.totalPages}
                                    onPageChange={vm.actions.setPage}
                                    isLoading={vm.query.isFetching}
                                    showStatus={false}
                                />
                            </div>

                            <PharmacyProductsListTable
                                items={vm.query.data?.items ?? []}
                                isLoading={vm.query.isFetching}
                                perPage={vm.filters.perPage}
                                sort={vm.filters.sort ?? "created_at_desc"}
                                onSortChange={vm.actions.setSort}
                            />

                            <Pagination
                                page={vm.filters.page}
                                totalPages={vm.meta.totalPages}
                                onPageChange={vm.actions.setPage}
                                isLoading={vm.query.isFetching}
                                showStatus={true}
                            />
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
