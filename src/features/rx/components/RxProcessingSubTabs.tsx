import { formatInt } from "@/shared/lib/format/figures";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
    RX_PROCESSING_TAB_ITEMS,
    type RxProcessingTab,
    type RxProcessingTabCounts,
} from "../lib/rx.processing-tabs";

export function RxProcessingSubTabs(props: {
    value?: RxProcessingTab;
    counts: RxProcessingTabCounts;
    onChange: (value?: RxProcessingTab) => void;
}) {
    const { value, counts, onChange } = props;

    const total =
        (counts.awaiting_payment ?? 0) +
        (counts.paid ?? 0) +
        (counts.shipping_ready ?? 0) +
        (counts.pickup_ready ?? 0);

    const tabValue = value ?? "all";

    return (
        <Tabs
            value={tabValue}
            onValueChange={(next) =>
                onChange(next === "all" ? undefined : (next as RxProcessingTab))
            }
        >
            <TabsList className="flex flex-wrap">
                {RX_PROCESSING_TAB_ITEMS.map((item) => {
                    const count =
                        item.value === "all"
                            ? total
                            : counts[
                            item.value as keyof RxProcessingTabCounts
                            ] ?? 0;

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