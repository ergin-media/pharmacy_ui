import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { TypographyH1 } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";

import { Trash2 } from "lucide-react";

import { usePharmacyProductsListPage } from "../hooks/usePharmacyProductsListPage";
import { PharmacyProductsToolbar } from "../components/PharmacyProductsToolbar";
import { PharmacyProductsListTable } from "../components/PharmacyProductsListTable";
import { usePharmacyProductPanels } from "../hooks/usePharmacyProductPanels";
import { useDeletePharmacyProductMutation } from "../delete-product/queries/pharmacy-product-delete.mutations";
import { useAppDialog } from "@/shared/ui/dialogs/appDialog.store";

export function PharmacyProductsListPage() {
    const vm = usePharmacyProductsListPage();
    const panels = usePharmacyProductPanels();
    const deleteMutation = useDeletePharmacyProductMutation();
    const { confirm } = useAppDialog();

    return (
        <div className="h-full w-full">
            <div className="mb-4 flex items-center justify-between">
                <TypographyH1>Produkte</TypographyH1>

                <Button onClick={panels.create.open}>
                    Artikel erstellen
                </Button>
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
                                onEdit={panels.edit.open}
                                onDelete={(product) => {
                                    confirm({
                                        title: "Artikel löschen",
                                        description: (
                                            <>
                                                Möchtest du den Artikel{" "}
                                                <span className="font-medium text-foreground">
                                                    {product.name}
                                                </span>{" "}
                                                wirklich löschen?
                                            </>
                                        ),
                                        icon: <Trash2 className="size-5" />,
                                        confirmLabel: "Löschen",
                                        cancelLabel: "Abbrechen",
                                        isDangerous: true,
                                        onConfirm: async () => {
                                            await deleteMutation.mutateAsync(
                                                product.id,
                                            );
                                        },
                                    });
                                }}
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