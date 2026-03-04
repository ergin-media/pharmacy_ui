import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

import { RX_QUEUES, type RxQueue } from "../lib/rx.queues";
import { formatCount } from "@/shared/lib/format/figures";

export type RxQueueCounts = Partial<Record<RxQueue, number>>;

export function RxQueueTabs(props: {
    value: RxQueue;
    onChange: (v: RxQueue) => void;
    counts?: RxQueueCounts;
}) {
    const { value, onChange, counts } = props;

    return (
        <Tabs
            value={value}
            onValueChange={(v) => onChange(v as RxQueue)}
            orientation="vertical"
        >
            <TabsList className="h-auto w-full flex-col items-stretch bg-transparent gap-1.5 p-0 rounded-0">
                {Object.entries(RX_QUEUES).map(([key, config]) => {
                    const queue = key as RxQueue;
                    const Icon = config.icon;
                    const count = counts?.[queue] ?? 0;
                    const badeBackgroundColor =
                        queue === "clarify" ? "bg-red-500" : "bg-white";

                    return (
                        <TabsTrigger
                            key={queue}
                            value={queue}
                            className={[
                                "w-full justify-between gap-2 rounded-lg",
                                "data-active:bg-background hover:bg-background",
                                "px-1.5 py-2 text-foreground font-normal group-data-[variant=default]/tabs-list:data-active:shadow-none",
                            ].join(" ")}
                        >
                            <span className="flex items-center gap-2 min-w-0">
                                <Icon className="h-4 w-4 shrink-0" />
                                <span className="truncate">{config.label}</span>
                            </span>

                            <Badge
                                variant={config.variant}
                                className={`h-5 rounded-full px-2 text-[11px] shrink-0 ${badeBackgroundColor}`}
                            >
                                {formatCount(count)}
                            </Badge>
                        </TabsTrigger>
                    );
                })}
            </TabsList>
        </Tabs>
    );
}
