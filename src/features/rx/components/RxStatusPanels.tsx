import { formatInt } from "@/shared/lib/format/figures";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
    RX_STATUS_PANEL_ITEMS,
    type RxStatusCounts,
    type RxStatusPanel,
} from "../lib/rx.status-panels";

export function RxStatusPanels(props: {
    value?: Exclude<RxStatusPanel, "all">;
    counts: RxStatusCounts;
    attentionCount?: number;
    onChange: (
        value?: "new" | "processing" | "completed" | "attention",
    ) => void;
}) {
    const { value, counts, attentionCount = 0, onChange } = props;

    const total =
        (counts.new ?? 0) + (counts.processing ?? 0) + (counts.completed ?? 0);

    const tabValue = value ?? "all";

    return (
        <Tabs
            value={tabValue}
            onValueChange={(next) =>
                onChange(
                    next === "all"
                        ? undefined
                        : (next as
                              | "new"
                              | "processing"
                              | "completed"
                              | "attention"),
                )
            }
        >
            <TabsList className="flex flex-wrap">
                {RX_STATUS_PANEL_ITEMS.map((item) => {
                    const count =
                        item.value === "all"
                            ? total
                            : item.value === "attention"
                              ? attentionCount
                              : (counts[item.value as keyof RxStatusCounts] ??
                                0);

                    return (
                        <TabsTrigger key={item.value} value={item.value}>
                            {item.label}
                            <span className="ml-2 opacity-80">
                                ({formatInt(count)})
                            </span>
                        </TabsTrigger>
                    );
                })}
            </TabsList>
        </Tabs>
    );
}
