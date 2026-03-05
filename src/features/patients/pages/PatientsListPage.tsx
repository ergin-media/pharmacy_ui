import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";

import { usePatientsListPage } from "../hooks/usePatientsListPage";
import { PatientsToolbar } from "../components/PatientsToolbar";
import { PatientsListTable } from "../components/PatientsListTable";
import { Separator } from "@/components/ui/separator";

export function PatientsListPage() {
    const vm = usePatientsListPage();

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Patienten</CardTitle>
            </CardHeader>

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

                            <Separator orientation="vertical" className="h-4" />

                            <PatientsToolbar
                                searchRaw={vm.filters.searchRaw}
                                sort={vm.filters.sort}
                                issues={vm.filters.issues}
                                perPage={vm.filters.perPage}
                                isFetching={vm.query.isFetching}
                                onSearchChange={vm.actions.setSearch}
                                onSortChange={vm.actions.setSort}
                                onIssuesChange={vm.actions.setIssues}
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

                        <PatientsListTable
                            items={vm.query.data?.items ?? []}
                            isLoading={vm.query.isFetching}
                            perPage={vm.filters.perPage}
                            sort={vm.filters.sort}
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
    );
}
