import { AlertTriangle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { RxTableRowVm } from "../lib/rx.table-row.vm";
import { getRxStatusBadge } from "../lib/rx.badges";

export function RxStatusCell(props: {
    row: RxTableRowVm;
    disabled?: boolean;
    isReparseBusy?: boolean;
    onReparse?: (id: number) => void;
}) {
    const { row } = props;

    const status = row.status;
    const hasAttention = row.hasAttention;

    const badge = getRxStatusBadge(status);

    return (
        <td className="whitespace-nowrap">
            <div
                className={cn(
                    "flex items-center gap-2",
                    hasAttention && "font-medium text-destructive",
                )}
            >
                {hasAttention ? (
                    <AlertTriangle className="size-4 shrink-0" />
                ) : null}

                <Badge
                    className={cn(
                        badge.className,
                        hasAttention && "ring-1 ring-destructive/30",
                    )}
                >
                    {badge.label}
                </Badge>
            </div>
        </td>
    );
}
