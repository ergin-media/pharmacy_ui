import { AlertTriangle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { RxTableRowVm } from "../lib/rx.table-row.vm";
import { getRxStatusBadge } from "../lib/rx.badges";
import {
    getRxProcessingTab,
} from "../lib/rx.processing-tabs";
import { getRxProcessingBadge } from "../lib/rx.processing-badges";

export function RxStatusCell(props: {
    row: RxTableRowVm;
    disabled?: boolean;
    isReparseBusy?: boolean;
    onReparse?: (id: number) => void;
}) {
    const { row } = props;

    const status = row.status;
    const hasAttention = row.hasAttention;

    const statusBadge = getRxStatusBadge(status);
    const processingTab = getRxProcessingTab(row.rx);
    const processingBadge = getRxProcessingBadge(processingTab);

    return (
        <td className="whitespace-nowrap">
            <div
                className={cn(
                    "flex flex-col gap-1",
                    hasAttention && "font-medium text-destructive",
                )}
            >
                <div className="flex items-center gap-2">
                    {hasAttention ? (
                        <AlertTriangle className="size-4 shrink-0" />
                    ) : null}

                    <Badge
                        className={cn(
                            statusBadge.className,
                            hasAttention && "ring-1 ring-destructive/30",
                        )}
                    >
                        {statusBadge.label}
                    </Badge>
                </div>

                {processingBadge ? (
                    <div>
                        <Badge className={processingBadge.className}>
                            {processingBadge.label}
                        </Badge>
                    </div>
                ) : null}
            </div>
        </td>
    );
}