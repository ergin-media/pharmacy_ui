"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { TypographyP } from "@/components/ui/typography";

import { RxListTable } from "./RxListTable";
import { RxQueueTabs } from "./RxQueueTabs";
import type {
    RxListVm,
    RxQueueVm,
    RxRowActions,
    RxTableVm,
    RxToolbarVm,
} from "../types/rx.list.vm";
import { RxListToolbar } from "./RxListToolbar";

export function RxListPageContent(props: {
    queueVm: RxQueueVm;
    listVm: RxListVm;
    toolbarVm: RxToolbarVm;
    tableVm: RxTableVm;
    rowActions: RxRowActions;
}) {
    const { queueVm, listVm, toolbarVm, tableVm, rowActions } = props;

    return (
        <div className="grid h-full gap-2 xl:grid-cols-[210px_1fr] 2xl:grid-cols-[225px_1fr]">
            <Card className="gap-3">
                <TypographyP className="pl-1 text-[.7rem] uppercase text-gray-400">
                    Prozesse
                </TypographyP>

                <RxQueueTabs
                    value={queueVm.value}
                    onChange={queueVm.setQueue}
                    counts={queueVm.counts}
                />
            </Card>

            <Card>
                <CardContent className="grid gap-4">
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
                        queue={tableVm.queue}
                        items={tableVm.items}
                        page={tableVm.page}
                        perPage={tableVm.perPage}
                        onOpen={rowActions.open}
                        onPdf={rowActions.pdf}
                        onMore={rowActions.more}
                        onCreateInvoice={rowActions.createInvoice}
                        isLoading={tableVm.isLoading}
                        onReparse={tableVm.onReparse}
                        reparseBusyId={tableVm.reparseBusyId}
                        onPrimaryAction={tableVm.onPrimaryAction}
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
