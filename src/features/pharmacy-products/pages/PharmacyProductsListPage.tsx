import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { usePharmacyProductsPage } from "../hooks/usePharmacyProductsPage";
import { PharmacyProductsToolbar } from "../components/PharmacyProductsToolbar";
import { PharmacyProductsTable } from "../components/PharmacyProductsTable";

export function PharmacyProductsListPage() {
    const vm = usePharmacyProductsPage();

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Apothekenprodukte</CardTitle>

                <PharmacyProductsToolbar
                    activeRaw={vm.filters.activeRaw}
                    sort={vm.filters.sort}
                    searchRaw={vm.filters.searchRaw}
                    isFetching={vm.query.isFetching}
                    onActiveChange={vm.actions.setActive}
                    onSortChange={vm.actions.setSort}
                    onSearchChange={vm.actions.setSearch}
                    onRefresh={vm.actions.refresh}
                />
            </CardHeader>

            <CardContent className="space-y-3">
                {vm.query.isLoading ? (
                    <div className="text-sm text-muted-foreground">Lade…</div>
                ) : vm.query.isError ? (
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
                        <div className="text-sm text-muted-foreground">
                            Gesamt:{" "}
                            <span className="font-medium text-foreground">
                                {vm.meta.total}
                            </span>
                        </div>

                        <PharmacyProductsTable
                            items={vm.query.data?.items ?? []}
                            isLoading={vm.query.isFetching}
                        />

                        {/* Pagination wie bei RX können wir direkt nachziehen,
                           sobald du mir sagst, ob du exakt die RxListPagination wiederverwenden willst. */}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
