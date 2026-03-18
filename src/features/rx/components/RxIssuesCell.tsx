import { Badge } from "@/components/ui/badge";
import { TableCell } from "@/components/ui/table";

import type { RxTableRowVm } from "../lib/rx.table-row.vm";

export function RxIssuesCell(props: { row: RxTableRowVm }) {
    const { row } = props;

    return (
        <TableCell>
            {row.issueMessages.length > 0 ? (
                <div className="flex flex-col items-start gap-1">
                    {row.issueMessages.map((message) => (
                        <Badge
                            key={message}
                            variant="danger"
                            className="max-w-full whitespace-normal text-left"
                        >
                            {message}
                        </Badge>
                    ))}
                </div>
            ) : (
                <div className="text-sm text-muted-foreground">—</div>
            )}
        </TableCell>
    );
}
