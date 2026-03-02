// src/features/rx/pages/RxListPage.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination } from "@/components/ui/pagination";

import { useRxListPage } from "../hooks/useRxListPage";
import { RxListToolbar } from "../components/RxListToolbar";
import { RxListTable } from "../components/RxListTable";
import { RxListTableSkeleton } from "../components/RxListTableSkeleton";
import { useRxPanels } from "../hooks/useRxPanels";
import { RX_QUEUE_TABS, type RxQueue } from "../lib/rx.queues";
import { Badge } from "@/components/ui/badge";
import { formatCount } from "@/shared/lib/format/figures";
import { Separator } from "@base-ui/react/separator";

export function RxListPage() {
    const vm = useRxListPage();
    const panels = useRxPanels();

    const tabValue = vm.filters.tabValue;
    //const countsByQueue = vm.meta.queueCounts ?? {};

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Rezepte</CardTitle>

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
                    <RxListTableSkeleton />
                ) : vm.query.isError ? (
                    <div className="flex items-center gap-2">
                        <div className="text-sm text-destructive">
                            Fehler: {(vm.query.error as Error)?.message ?? "unknown"}
                        </div>
                        <Button variant="outline" size="sm" onClick={vm.actions.refresh}>
                            Erneut versuchen
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* ✅ Queue Tabs */}
                        <Tabs
                            value={tabValue}
                            onValueChange={(v) => vm.actions.setQueue(v as RxQueue)}
                        >
                            <Tabs value={tabValue} onValueChange={(v) => vm.actions.setQueue(v as any)}>
                                <TabsList className="flex flex-wrap">
                                    {RX_QUEUE_TABS.map((t) => {
                                        const Icon = t.icon;
                                        const count = 0; //countsByQueue[t.value];

                                        // optional: nur zeigen wenn > 0
                                        const showBadge = typeof count === "number" && count > 0;

                                        return (
                                            <>
                                                <TabsTrigger key={t.value} value={t.value} className="gap-2">
                                                    <Icon className="h-4 w-4" />
                                                    <span>{t.label}</span>

                                                    {showBadge ? (
                                                        <Badge
                                                            variant={t.value === "clarify" ? "destructive" : "secondary"}
                                                            className="ml-1 h-5 rounded-full px-2 text-[11px]"
                                                        >
                                                            {formatCount(count)}
                                                        </Badge>
                                                    ) : null}
                                                </TabsTrigger>
                                                <Separator orientation="vertical" className="h-4 w-px bg-black/10 last-of-type:hidden" />
                                            </>
                                        );
                                    })}
                                </TabsList>
                            </Tabs>
                        </Tabs>

                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="text-sm text-muted-foreground">
                                Gesamt: <span className="font-medium text-foreground">{vm.meta.total}</span>
                            </div>

                            <Pagination
                                page={vm.filters.page}
                                totalPages={vm.meta.totalPages}
                                onPageChange={vm.actions.setPage}
                                isLoading={vm.query.isFetching}
                                showStatus={false}
                            />
                        </div>

                        <RxListTable
                            items={vm.query.data?.items ?? []}
                            perPage={vm.filters.perPage}
                            onOpen={(id) => console.log("open", id)}
                            onPdf={(id) => console.log("pdf", id)}
                            onMore={(id) => console.log("more", id)}
                            onCreateInvoice={(id) => panels.invoice.open(id)}
                            isLoading={vm.query.isFetching}
                            onReparse={vm.actions.reparse}
                            reparseBusyId={vm.meta.reparseBusyId}
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