import { TableCell } from "@/components/ui/table";
import { AlertTriangle } from "lucide-react";

import type { RxTableRowVm } from "../lib/rx.table-row.vm";

export function RxIssuesCell(props: { row: RxTableRowVm }) {
    const { row } = props;

    return (
        <TableCell>
            {row.issueMessages.length > 0 ? (
                <div className="flex flex-col gap-1">
                    {row.issueMessages.map((message) => (
                        <div
                            key={message}
                            className="flex items-start gap-2 text-xs text-destructive"
                        >
                            <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                            <span>{message}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-sm text-muted-foreground">—</div>
            )}
        </TableCell>
    );
}
