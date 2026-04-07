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

    const firstTab = RX_PROCESSING_TAB_ITEMS[0]?.value;
    const tabValue = value ?? firstTab;

    if (!firstTab) {
        return null;
    }

    return (
        <Tabs
            value={tabValue}
            onValueChange={(next) => onChange(next as RxProcessingTab)}
        >
            <TabsList className="flex flex-wrap">
                {RX_PROCESSING_TAB_ITEMS.map((item) => {
                    const count = counts[item.value] ?? 0;

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