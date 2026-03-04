// src/features/rx/pages/RxListPage.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { useRxListPage } from "../hooks/useRxListPage";
import { RxListToolbar } from "../components/RxListToolbar";
import { RxListTable } from "../components/RxListTable";
import { RxListTableSkeleton } from "../components/RxListTableSkeleton";
import { useRxPanels } from "../hooks/useRxPanels";
import { RX_QUEUES, type RxQueue } from "../lib/rx.queues";

import { formatCount } from "@/shared/lib/format/figures";

export function RxListPage() {
    const vm = useRxListPage();
    const panels = useRxPanels();

    const tabValue = vm.filters.tabValue;

    if (vm.query.isLoading && !vm.query.data) {
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
                    <RxListTableSkeleton />
                </CardContent>
            </Card>
        );
    }

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
                {vm.query.isError ? (
                    <div className="flex items-center gap-2">
                        <div className="text-sm text-destructive">
                            Fehler: {(vm.query.error as Error)?.message ?? "unknown"}
                        </div>
                        <Button variant="outline" size="sm" onClick={vm.actions.refresh}>
                            Erneut versuchen
                        </Button>
                    </div>
                ) : null}

                {/* ✅ 2-Spalten Layout: Links Queues, rechts Content */}
                <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
                    {/* LEFT: Queue Sidebar */}
                    <div className="rounded-xl border bg-white p-2">
                        <div className="px-2 pb-2 pt-1 text-xs font-medium text-muted-foreground">
                            Prozess
                        </div>

                        <Tabs
                            value={tabValue}
                            onValueChange={(v) => vm.actions.setQueue(v as RxQueue)}
                            orientation="vertical"
                        >
                            <TabsList className="h-auto w-full flex-col items-stretch bg-transparent p-0">
                                {Object.entries(RX_QUEUES).map(([value, config]) => {
                                    const Icon = config.icon;
                                    const count = vm.meta.queueCounts?.[value as RxQueue] ?? 0;

                                    return (
                                        <TabsTrigger
                                            key={value}
                                            value={value}
                                            className={[
                                                "w-full justify-between gap-2",
                                                "data-[state=active]:bg-muted",
                                                "px-3 py-2",
                                            ].join(" ")}
                                        >
                                            <span className="flex items-center gap-2">
                                                <Icon className="h-4 w-4" />
                                                <span className="truncate">{config.label}</span>
                                            </span>

                                            <Badge
                                                variant={config.variant}
                                                className="h-5 rounded-full px-2 text-[11px]"
                                            >
                                                {formatCount(count)}
                                            </Badge>
                                        </TabsTrigger>
                                    );
                                })}
                            </TabsList>
                        </Tabs>

                        <Separator className="my-3" />

                        <div className="px-2 text-xs text-muted-foreground">
                            Gesamt:{" "}
                            <span className="font-medium text-foreground">
                                {vm.meta.total}
                            </span>
                        </div>
                    </div>

                    {/* RIGHT: Table + Pagination */}
                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="text-sm text-muted-foreground">
                                Seite{" "}
                                <span className="font-medium text-foreground">
                                    {vm.filters.page}
                                </span>{" "}
                                von{" "}
                                <span className="font-medium text-foreground">
                                    {vm.meta.totalPages}
                                </span>
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
                            page={vm.filters.page}
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
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}