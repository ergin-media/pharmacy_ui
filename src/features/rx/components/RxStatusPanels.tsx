import { Button } from "@/components/ui/button";
import {
    RX_STATUS_PANEL_ITEMS,
    type RxStatusCounts,
    type RxStatusPanel,
} from "../lib/rx.status-panels";
import { formatInt } from "@/shared/lib/format/figures";
import { AlertTriangle } from "lucide-react";

export function RxStatusPanels(props: {
    value?: Exclude<RxStatusPanel, "all">;
    counts: RxStatusCounts;
    attentionCount?: number;
    onChange: (value?: "new" | "processing" | "completed") => void;
}) {
    const { value, counts, attentionCount = 0, onChange } = props;

    const total =
        (counts.new ?? 0) + (counts.processing ?? 0) + (counts.completed ?? 0);

    return (
        <div className="flex flex-wrap items-center gap-2">
            {RX_STATUS_PANEL_ITEMS.map((item) => {
                const isActive =
                    item.value === "all" ? value == null : value === item.value;

                const count =
                    item.value === "all"
                        ? total
                        : (counts[item.value as keyof RxStatusCounts] ?? 0);

                return (
                    <Button
                        key={item.value}
                        type="button"
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                            onChange(
                                item.value === "all"
                                    ? undefined
                                    : (item.value as
                                          | "new"
                                          | "processing"
                                          | "completed"),
                            )
                        }
                    >
                        {item.label}
                        <span className="ml-2 opacity-80">
                            ({formatInt(count)})
                        </span>
                    </Button>
                );
            })}

            {attentionCount > 0 ? (
                <div className="ml-auto flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/5 px-3 py-1.5 text-sm text-destructive">
                    <AlertTriangle className="size-4" />
                    <span>{formatInt(attentionCount)} mit Handlungsbedarf</span>
                </div>
            ) : null}
        </div>
    );
}
