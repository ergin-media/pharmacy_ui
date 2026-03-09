import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { formatCount, formatInt } from "@/shared/lib/format/figures";

import {
    RX_QUEUE_ITEMS_VISIBLE,
    type RxQueue,
    type RxQueueCounts,
} from "../lib/rx.queues";
import { getTotalQueueCount } from "../lib/rx.helpers";
import { Separator } from "@/components/ui/separator";

export function RxQueueTabs(props: {
    value: RxQueue;
    onChange: (v: RxQueue) => void;
    counts?: RxQueueCounts;
}) {
    const { value, onChange, counts } = props;

    return (
        <TooltipProvider>
            <Tabs
                value={value}
                onValueChange={(v) => onChange(v as RxQueue)}
                orientation="vertical"
            >
                <TabsList className="h-auto w-full flex-col items-stretch gap-1.5 rounded-0 bg-transparent p-0">
                    {RX_QUEUE_ITEMS_VISIBLE.map((item) => {
                        const Icon = item.icon;

                        const count =
                            item.value === "all"
                                ? getTotalQueueCount(counts)
                                : (counts?.[item.value] ?? 0);

                        const badgeBackgroundColor =
                            item.value === "clarify"
                                ? "bg-red-500"
                                : "bg-white";

                        const trigger = (
                            <TabsTrigger
                                key={item.value}
                                value={item.value}
                                className={[
                                    "w-full justify-between gap-2 rounded-lg",
                                    "data-active:bg-background hover:bg-background",
                                    "px-1.5 py-2 font-normal text-foreground",
                                    "group-data-[variant=default]/tabs-list:data-active:shadow-none",
                                ].join(" ")}
                            >
                                <span className="flex min-w-0 items-center gap-2">
                                    <Icon className="h-4 w-4 shrink-0" />
                                    <span className="truncate">
                                        {item.label}
                                    </span>
                                </span>

                                <Badge
                                    variant={item.variant}
                                    className={`h-5 shrink-0 rounded-full px-2 text-[11px] ${badgeBackgroundColor}`}
                                >
                                    {formatCount(count)}
                                </Badge>
                            </TabsTrigger>
                        );

                        if (count <= 99) return trigger;

                        return (
                            <>
                                <Tooltip key={item.value}>
                                    <TooltipTrigger>{trigger}</TooltipTrigger>

                                    <TooltipContent side="right">
                                        {formatInt(count)} Rezepte
                                    </TooltipContent>
                                </Tooltip>
                                {item.value === "all" && (
                                    <Separator className="my-1 opacity-60" />
                                )}
                            </>
                        );
                    })}
                </TabsList>
            </Tabs>
        </TooltipProvider>
    );
}
