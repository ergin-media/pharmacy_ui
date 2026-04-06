import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, RotateCcw } from "lucide-react";

import type { RxTableRowVm } from "../lib/rx.table-row.vm";
import { TableCell } from "@/components/ui/table";
import {
    getRxUiStatus,
    getRxUiStatusLabel,
    getRxUiStatusVariant,
} from "../lib/rx.status";

export function RxStatusCell(props: {
    row: RxTableRowVm;
    disabled?: boolean;
    isReparseBusy?: boolean;
    onReparse?: (id: number) => void;
}) {
    const { row, disabled, isReparseBusy, onReparse } = props;

    const uiStatus = getRxUiStatus(row.rx);

    return (
        <TableCell>
            <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                    <Badge variant={getRxUiStatusVariant(uiStatus)}>
                        {getRxUiStatusLabel(uiStatus)}
                    </Badge>
                </div>

                {row.showReparse ? (
                    <div>
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
                    </div>
                ) : null}
            </div>
        </TableCell>
    );
}