import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { TypographyH1 } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";

import { usePharmacyProductsListPage } from "../hooks/usePharmacyProductsListPage";
import { PharmacyProductsToolbar } from "../components/PharmacyProductsToolbar";
import { PharmacyProductsListTable } from "../components/PharmacyProductsListTable";
import { usePharmacyProductsPageActions } from "../hooks/usePharmacyProductsPageActions";
import { Plus, Upload } from "lucide-react";

export function PharmacyProductsListPage() {
    const vm = usePharmacyProductsListPage();
    const pageActions = usePharmacyProductsPageActions();

    return (
        <div className="h-full w-full">
            <div className="mb-4 flex items-center justify-between">
                <TypographyH1>Produkte</TypographyH1>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={pageActions.actions.import}
                    >
                        <Upload className="mr-1 size-4" />
                        CSV importieren
                    </Button>

                    <Button onClick={pageActions.actions.create}>
                        <Plus className="mr-1 size-4" />
                        Artikel erstellen
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="space-y-3">
                    {vm.query.isError ? (
                        <div className="flex items-center gap-2">
                            <div className="text-sm text-destructive">
                                Fehler:{" "}
                                {(vm.query.error as Error)?.message ?? "unknown"}
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
                                onEdit={pageActions.actions.edit}
                                onDelete={pageActions.actions.remove}
                            />

                            <Pagination
                                page={vm.filters.page}
                                totalPages={vm.meta.totalPages}
                                onPageChange={vm.actions.setPage}
                                isLoading={vm.query.isFetching}
                                showStatus
                            />
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}