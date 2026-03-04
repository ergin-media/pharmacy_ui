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
            <TabsList className="h-auto w-full flex-col items-stretch bg-transparent">
                {Object.entries(RX_QUEUES).map(([key, config]) => {
                    const queue = key as RxQueue;
                    const Icon = config.icon;
                    const count = counts?.[queue] ?? 0;

                    return (
                        <TabsTrigger
                            key={queue}
                            value={queue}
                            className={[
                                "w-full justify-between gap-2",
                                "data-[state=active]:bg-muted",
                                "px-3 py-2 ",
                            ].join(" ")}
                        >
                            <span className="flex items-center gap-2 min-w-0">
                                <Icon className="h-4 w-4 shrink-0" />
                                <span className="truncate">{config.label}</span>
                            </span>

                            <Badge
                                variant={config.variant}
                                className="h-5 rounded-full px-2 text-[11px] shrink-0"
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
