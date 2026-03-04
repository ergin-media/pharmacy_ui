// src/features/rx/pages/RxListPage.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";

import { useRxListPage } from "../hooks/useRxListPage";
import { RxListToolbar } from "../components/RxListToolbar";
import { RxListTable } from "../components/RxListTable";
import { RxListTableSkeleton } from "../components/RxListTableSkeleton";
import { useRxPanels } from "../hooks/useRxPanels";
import type { RxQueue } from "../lib/rx.queues";

import { RxQueueTabs } from "../components/RxQueueTabs";
import { TypographyH1, TypographyP } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";

export function RxListPage() {
    const vm = useRxListPage();
    const panels = useRxPanels();

    const tabValue = vm.filters.tabValue;

    return (
        <div className="h-full w-full">
            <TypographyH1 className="mb-4">Rezepte</TypographyH1>
            {vm.query.isLoading && !vm.query.data ? (
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
                            onWorkflowStatusChange={
                                vm.actions.setWorkflowStatus
                            }
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
            ) : (
                <div className="grid 2xl:grid-cols-[225px_1fr] xl:grid-cols-[210px_1fr] gap-2 h-full">
                    <Card className="gap-3">
                        <TypographyP className="text-[.7rem] uppercase text-gray-400 pl-1">
                            Prozesse
                        </TypographyP>
                        <RxQueueTabs
                            value={tabValue}
                            onChange={(v) => vm.actions.setQueue(v as RxQueue)}
                            counts={vm.meta.queueCounts}
                        />
                    </Card>

                    <Card>
                        <CardContent className="grid gap-4">
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
                            ) : null}

                            <div className="flex flex-wrap items-center justify-between">
                                <div className="flex gap-4 items-center flex-1">
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

                                    <Separator
                                        orientation="vertical"
                                        className="h-4"
                                    />

                                    <RxListToolbar
                                        parseStatus={vm.filters.parseStatus}
                                        workflowStatus={
                                            vm.filters.workflowStatus
                                        }
                                        paymentState={vm.filters.paymentState}
                                        providerRaw={vm.filters.providerRaw}
                                        searchRaw={vm.filters.searchRaw}
                                        sort={vm.filters.sort}
                                        perPage={vm.filters.perPage}
                                        isFetching={vm.query.isFetching}
                                        onParseStatusChange={
                                            vm.actions.setParseStatus
                                        }
                                        onWorkflowStatusChange={
                                            vm.actions.setWorkflowStatus
                                        }
                                        onPaymentStateChange={
                                            vm.actions.setPaymentState
                                        }
                                        onProviderChange={
                                            vm.actions.setProvider
                                        }
                                        onSearchChange={vm.actions.setSearch}
                                        onSortChange={vm.actions.setSort}
                                        onPerPageChange={vm.actions.setPerPage}
                                        onRefresh={vm.actions.refresh}
                                    />
                                </div>

                                <div className="flex gap-4 items-center">
                                    <Separator
                                        orientation="vertical"
                                        className="h-4"
                                    />

                                    <Pagination
                                        page={vm.filters.page}
                                        totalPages={vm.meta.totalPages}
                                        onPageChange={vm.actions.setPage}
                                        isLoading={vm.query.isFetching}
                                        showStatus={false}
                                    />
                                </div>
                            </div>

                            <RxListTable
                                items={vm.query.data?.items ?? []}
                                page={vm.filters.page}
                                perPage={vm.filters.perPage}
                                onOpen={(id) => console.log("open", id)}
                                onPdf={(id) => console.log("pdf", id)}
                                onMore={(id) => console.log("more", id)}
                                onCreateInvoice={(id) =>
                                    panels.invoice.open(id)
                                }
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
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
