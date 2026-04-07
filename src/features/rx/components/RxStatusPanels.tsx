import { AlertTriangle } from "lucide-react";

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
    onChange: (value?: "new" | "processing" | "completed") => void;
}) {
    const { value, counts, attentionCount = 0, onChange } = props;

    const total =
        (counts.new ?? 0) + (counts.processing ?? 0) + (counts.completed ?? 0);

    const tabValue = value ?? "all";

    return (
        <div className="flex flex-wrap items-center gap-3">
            <Tabs
                value={tabValue}
                onValueChange={(next) =>
                    onChange(
                        next === "all"
                            ? undefined
                            : (next as "new" | "processing" | "completed"),
                    )
                }
            >
                <TabsList className="flex flex-wrap">
                    {RX_STATUS_PANEL_ITEMS.map((item) => {
                        const count =
                            item.value === "all"
                                ? total
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

            {attentionCount > 0 ? (
                <div className="ml-auto flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/5 px-3 py-1.5 text-sm text-destructive">
                    <AlertTriangle className="size-4" />
                    <span>{formatInt(attentionCount)} mit Handlungsbedarf</span>
                </div>
            ) : null}
        </div>
    );
}
