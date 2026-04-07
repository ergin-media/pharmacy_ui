"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";

import { RxListTable } from "./RxListTable";
import { RxStatusPanels } from "./RxStatusPanels";
import type {
    RxListVm,
    RxRowActions,
    RxStatusVm,
    RxTableVm,
    RxToolbarVm,
} from "../types/rx.list.vm";
import { RxListToolbar } from "./RxListToolbar";

export function RxListPageContent(props: {
    statusVm: RxStatusVm;
    listVm: RxListVm;
    toolbarVm: RxToolbarVm;
    tableVm: RxTableVm;
    rowActions: RxRowActions;
}) {
    const { statusVm, listVm, toolbarVm, tableVm, rowActions } = props;

    return (
        <div className="grid h-full gap-2">
            <Card>
                <CardContent className="grid gap-4">
                    <RxStatusPanels
                        value={statusVm.value}
                        counts={statusVm.counts}
                        attentionCount={statusVm.attentionCount}
                        onChange={statusVm.setStatus}
                    />

                    {listVm.isError ? (
                        <div className="flex items-center gap-2">
                            <div className="text-sm text-destructive">
                                Fehler:{" "}
                                {(listVm.error as Error)?.message ?? "unknown"}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={listVm.refresh}
                            >
                                Erneut versuchen
                            </Button>
                        </div>
                    ) : null}

                    <RxListToolbar
                        {...toolbarVm}
                        page={listVm.page}
                        totalPages={listVm.totalPages}
                        onPageChange={listVm.setPage}
                    />

                    <RxListTable
                        items={tableVm.items}
                        page={tableVm.page}
                        perPage={tableVm.perPage}
                        onOpen={rowActions.open}
                        onPdf={rowActions.pdf}
                        onMore={rowActions.more}
                        onCreateInvoice={rowActions.createInvoice}
                        isLoading={tableVm.isLoading}
                        onReparse={tableVm.onReparse}
                        isReparseBusy={tableVm.isReparseBusy}
                        onPrimaryAction={tableVm.onPrimaryAction}
                        isPrimaryActionPending={tableVm.isPrimaryActionPending}
                        activePrimaryActionId={tableVm.activePrimaryActionId}
                    />

                    <Pagination
                        page={listVm.page}
                        totalPages={listVm.totalPages}
                        onPageChange={listVm.setPage}
                        isLoading={listVm.isFetching}
                        showStatus
                    />
                </CardContent>
            </Card>
        </div>
    );
}
