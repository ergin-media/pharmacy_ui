import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import { Loader2, RotateCcw } from "lucide-react";

import type { RxTableRowVm } from "../lib/rx.table-row.vm";

export function RxIssuesCell(props: {
    row: RxTableRowVm;
    disabled?: boolean;
    isReparseBusy?: boolean;
    onReparse?: (id: number) => void;
}) {
    const { row, disabled, isReparseBusy, onReparse } = props;

    return (
        <TableCell>
            <div className="flex flex-col items-start gap-2">
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

                {row.showReparse ? (
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => onReparse?.(row.id)}
                        disabled={disabled || isReparseBusy}
                    >
                        {isReparseBusy ? (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                        ) : (
                            <RotateCcw className="mr-2 size-4" />
                        )}
                        Reparse
                    </Button>
                ) : null}
            </div>
        </TableCell>
    );
}
