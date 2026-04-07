import type { ComponentProps } from "react";

import { AlertTriangle } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import type { RxTableRowVm } from "../lib/rx.table-row.vm";
import { getRxStatusBadge } from "../lib/rx.badges";
import { cn } from "@/lib/utils";

export function RxStatusCell(props: {
    row: RxTableRowVm;
    disabled?: boolean;
    isReparseBusy?: boolean;
    onReparse?: (id: number) => void;
}) {
    const { row } = props;

    const status = row.rx.status;
    const hasAttention = row.hasAttention;

    type BadgeVariant = ComponentProps<typeof Badge>["variant"];
    const badge = getRxStatusBadge(status) as {
        label: string;
        variant: BadgeVariant;
    };

    return (
        <td className="whitespace-nowrap">
            <div
                className={cn(
                    "flex items-center gap-2",
                    hasAttention && "text-destructive",
                )}
            >
                {hasAttention ? (
                    <AlertTriangle className="size-4 shrink-0" />
                ) : null}

                <Badge variant={badge.variant}>{badge.label}</Badge>
            </div>
        </td>
    );
}
