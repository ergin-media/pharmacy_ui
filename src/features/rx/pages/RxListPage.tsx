"use client";

import { TypographyH1 } from "@/components/ui/typography";

import { useRxListPage } from "../hooks/useRxListPage";
import { useRxPanels } from "../hooks/useRxPanels";
import { RxListToolbar } from "../components/RxListToolbar";

import type { RxQueue } from "../lib/rx.queues";
import { RxListPageContent } from "../components/RxListPageContent";
import { RxListPageLoading } from "../components/RxListPageLoading";

export function RxListPage() {
    const vm = useRxListPage();
    const panels = useRxPanels();

    const toolbarProps: React.ComponentProps<typeof RxListToolbar> = {
        total: vm.meta.total,
        page: vm.filters.page,
        totalPages: vm.meta.totalPages,
        parseStatus: vm.filters.parseStatus,
        workflowStatus: vm.filters.workflowStatus,
        paymentState: vm.filters.paymentState,
        providerRaw: vm.filters.providerRaw,
        searchRaw: vm.filters.searchRaw,
        sort: vm.filters.sort,
        perPage: vm.filters.perPage,
        isFetching: vm.query.isFetching,
        onParseStatusChange: vm.actions.setParseStatus,
        onWorkflowStatusChange: vm.actions.setWorkflowStatus,
        onPaymentStateChange: vm.actions.setPaymentState,
        onProviderChange: vm.actions.setProvider,
        onSearchChange: vm.actions.setSearch,
        onSortChange: vm.actions.setSort,
        onPerPageChange: vm.actions.setPerPage,
        onRefresh: vm.actions.refresh,
    };

    return (
        <div className="h-full w-full">
            <TypographyH1 className="mb-4">Rezepte</TypographyH1>

            {vm.query.isLoading && !vm.query.data ? (
                <RxListPageLoading
                    perPage={vm.filters.perPage}
                    toolbarProps={toolbarProps}
                />
            ) : (
                <RxListPageContent
                    tabValue={vm.filters.tabValue}
                    queueCounts={vm.meta.queueCounts}
                    page={vm.filters.page}
                    totalPages={vm.meta.totalPages}
                    isFetching={vm.query.isFetching}
                    error={vm.query.isError ? vm.query.error : null}
                    toolbarProps={toolbarProps}
                    items={vm.query.data?.items ?? []}
                    perPage={vm.filters.perPage}
                    onSetQueue={(v) => vm.actions.setQueue(v as RxQueue)}
                    onSetPage={vm.actions.setPage}
                    onRefresh={vm.actions.refresh}
                    onOpen={(id) => console.log("open", id)}
                    onPdf={(id) => console.log("pdf", id)}
                    onMore={(id) => console.log("more", id)}
                    onCreateInvoice={(id) => panels.invoice.open(id)}
                    onReparse={vm.actions.reparse}
                    reparseBusyId={vm.meta.reparseBusyId}
                />
            )}
        </div>
    );
}
