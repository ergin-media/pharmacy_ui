"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { TypographyP } from "@/components/ui/typography";

import { RxListToolbar } from "./RxListToolbar";
import { RxListTable } from "./RxListTable";
import { RxQueueTabs } from "./RxQueueTabs";
import type { RxQueue } from "../lib/rx.queues";
import type { RxListItemDto } from "../types/rx.dto";

export function RxListPageContent(props: {
    tabValue: RxQueue;
    queueCounts?: Partial<Record<RxQueue, number>>;
    page: number;
    totalPages: number;
    isFetching: boolean;
    error: unknown;
    toolbarProps: React.ComponentProps<typeof RxListToolbar>;
    items: RxListItemDto[];
    perPage: number;
    onSetQueue: (v: RxQueue) => void;
    onSetPage: (page: number) => void;
    onRefresh: () => void;
    onOpen: (id: number) => void;
    onPdf: (id: number) => void;
    onMore: (id: number) => void;
    onCreateInvoice: (id: number) => void;
    onReparse: (id: number) => void;
    reparseBusyId: number | null;
}) {
    const {
        tabValue,
        queueCounts,
        page,
        totalPages,
        isFetching,
        error,
        toolbarProps,
        items,
        perPage,
        onSetQueue,
        onSetPage,
        onRefresh,
        onOpen,
        onPdf,
        onMore,
        onCreateInvoice,
        onReparse,
        reparseBusyId,
    } = props;

    return (
        <div className="grid h-full gap-2 xl:grid-cols-[210px_1fr] 2xl:grid-cols-[225px_1fr]">
            <Card className="gap-3">
                <TypographyP className="pl-1 text-[.7rem] uppercase text-gray-400">
                    Prozesse
                </TypographyP>

                <RxQueueTabs
                    value={tabValue}
                    onChange={onSetQueue}
                    counts={queueCounts}
                />
            </Card>

            <Card>
                <CardContent className="grid gap-4">
                    {error ? (
                        <div className="flex items-center gap-2">
                            <div className="text-sm text-destructive">
                                Fehler: {(error as Error)?.message ?? "unknown"}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onRefresh}
                            >
                                Erneut versuchen
                            </Button>
                        </div>
                    ) : null}

                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-1 items-center">
                            <RxListToolbar {...toolbarProps} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Separator orientation="vertical" className="h-4" />

                            <Pagination
                                page={page}
                                totalPages={totalPages}
                                onPageChange={onSetPage}
                                isLoading={isFetching}
                                showStatus={false}
                            />
                        </div>
                    </div>

                    <RxListTable
                        items={items}
                        page={page}
                        perPage={perPage}
                        onOpen={onOpen}
                        onPdf={onPdf}
                        onMore={onMore}
                        onCreateInvoice={onCreateInvoice}
                        isLoading={isFetching}
                        onReparse={onReparse}
                        reparseBusyId={reparseBusyId}
                    />

                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={onSetPage}
                        isLoading={isFetching}
                        showStatus
                    />
                </CardContent>
            </Card>
        </div>
    );
}