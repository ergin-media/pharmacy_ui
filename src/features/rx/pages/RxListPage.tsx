import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useRxListPage } from "../hooks/useRxListPage";
import { RxListToolbar } from "../components/RxListToolbar";
import { RxListTable } from "../components/RxListTable";
import { RxListPagination } from "../components/RxListPagination";
import { useRxInvoiceDrawer } from "../hooks/useRxInvoiceDrawer";
import { RxInvoiceDrawer } from "../components/RxInvoiceDrawer";

export function RxListPage() {
    const vm = useRxListPage();

    const invoiceDrawer = useRxInvoiceDrawer({
        onCreated: async () => {
            await vm.query.refetch();
        },
    });

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>RX</CardTitle>

                <RxListToolbar
                    parseStatus={vm.filters.parseStatus}
                    workflowStatus={vm.filters.workflowStatus}
                    paymentState={vm.filters.paymentState}
                    providerRaw={vm.filters.providerRaw}
                    searchRaw={vm.filters.searchRaw}
                    sort={vm.filters.sort}
                    perPage={vm.filters.perPage}
                    isFetching={vm.query.isFetching}
                    onParseStatusChange={vm.actions.setParseStatus}
                    onWorkflowStatusChange={vm.actions.setWorkflowStatus}
                    onPaymentStateChange={vm.actions.setPaymentState}
                    onProviderChange={vm.actions.setProvider}
                    onSearchChange={vm.actions.setSearch}
                    onSortChange={vm.actions.setSort}
                    onPerPageChange={vm.actions.setPerPage}
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
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                            <div className="text-sm text-muted-foreground">
                                Gesamt:{" "}
                                <span className="font-medium text-foreground">
                                    {vm.meta.total}
                                </span>
                            </div>

                            <RxListPagination
                                page={vm.filters.page}
                                totalPages={vm.meta.totalPages}
                                onPageChange={vm.actions.setPage}
                                isLoading={vm.query.isFetching}
                                showStatus={false} // 👈 oben kein "Seite x / y" Text
                            />
                        </div>

                        <RxListTable
                            items={vm.query.data?.items ?? []}
                            perPage={vm.filters.perPage}
                            onOpen={(id) => console.log("open", id)}
                            onPdf={(id) => console.log("pdf", id)}
                            onMore={(id) => console.log("more", id)}
                            onCreateInvoice={(id) => invoiceDrawer.actions.openFor(id)}
                            isLoading={vm.query.isFetching}
                        />

                        <RxListPagination
                            page={vm.filters.page}
                            totalPages={vm.meta.totalPages}
                            onPageChange={vm.actions.setPage}
                            isLoading={vm.query.isFetching}
                            showStatus={true}
                        />

                        <RxInvoiceDrawer
                            open={invoiceDrawer.state.open}
                            rxId={invoiceDrawer.state.rxId}
                            onOpenChange={(open) => {
                                if (!open) invoiceDrawer.actions.close();
                                else invoiceDrawer.actions.setOpen(true);
                            }}
                            onCancel={invoiceDrawer.actions.close}
                            onCreated={invoiceDrawer.actions.onCreated}
                        />
                    </>
                )}
            </CardContent>
        </Card>
    );
}
