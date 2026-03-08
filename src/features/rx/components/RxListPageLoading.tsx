"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { RxListToolbar } from "./RxListToolbar";
import { RxListTable } from "./RxListTable";
import { RxQueueTabsSkeleton } from "./RxQueueTabsSkeleton";

export function RxListPageLoading(props: {
    perPage: number;
    toolbarProps: React.ComponentProps<typeof RxListToolbar>;
}) {
    const { perPage, toolbarProps } = props;

    return (
        <div className="grid h-full gap-2 xl:grid-cols-[210px_1fr] 2xl:grid-cols-[225px_1fr]">
            <RxQueueTabsSkeleton />

            <Card>
                <CardContent className="grid gap-4">
                    <div className="flex flex-wrap items-center justify-between">
                        <div className="flex flex-1 items-center gap-4">
                            <div className="text-sm text-muted-foreground">
                                Seite{" "}
                                <span className="font-medium text-foreground">
                                    1
                                </span>{" "}
                                von{" "}
                                <span className="font-medium text-foreground">
                                    —
                                </span>
                            </div>

                            <Separator orientation="vertical" className="h-4" />

                            <RxListToolbar {...toolbarProps} />
                        </div>
                    </div>

                    <RxListTable items={[]} page={1} perPage={perPage} isLoading />
                </CardContent>
            </Card>
        </div>
    );
}