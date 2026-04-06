import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RxOverviewTable } from "./RxOverviewTable";
import { RxOverviewToolbar } from "./RxOverviewToolbar";
import type { useRxOverviewPage } from "../hooks/useRxOverviewPage";

export function RxOverviewPageContent(props: {
    vm: ReturnType<typeof useRxOverviewPage>;
}) {
    const { vm } = props;

    return (
        <Card>
            <CardContent className="grid gap-4">
                {vm.isError ? (
                    <div className="flex items-center gap-2">
                        <div className="text-sm text-destructive">
                            Fehler: {(vm.error as Error)?.message ?? "unknown"}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => vm.query.refetch()}
                        >
                            Erneut versuchen
                        </Button>
                    </div>
                ) : null}

                <RxOverviewToolbar
                    total={vm.total}
                    page={vm.page}
                    totalPages={vm.totalPages}
                    providerRaw={vm.filters.provider}
                    searchRaw={vm.filters.search}
                    perPage={vm.perPage}
                    status={vm.filters.status}
                    onlyAttention={vm.filters.onlyAttention}
                    isFetching={vm.isFetching}
                    onPageChange={vm.actions.setPage}
                    onProviderChange={vm.actions.setProvider}
                    onSearchChange={vm.actions.setSearch}
                    onPerPageChange={vm.actions.setPerPage}
                    onStatusChange={vm.actions.setStatus}
                    onOnlyAttentionChange={vm.actions.setOnlyAttention}
                />

                <RxOverviewTable
                    items={vm.items}
                    isLoading={vm.isLoading}
                    page={vm.page}
                    perPage={vm.perPage}
                    onPrimaryAction={vm.actions.runPrimaryAction}
                    activeActionId={vm.activeActionId}
                    onOpen={vm.actions.open}
                    onDelete={vm.actions.delete}
                />
            </CardContent>
        </Card>
    );
}