import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

import type { RxTableRowVm } from "../lib/rx.table-row.vm";
import {
    getRxUiAction,
    getRxUiActionLabel,
} from "../lib/rx.actions";

export function RxPrimaryActionCell(props: {
    row: RxTableRowVm;
    disabled?: boolean;
    isLoading?: boolean;
    onClick?: (rx: RxTableRowVm["rx"]) => void;
}) {
    const { row, disabled, isLoading, onClick } = props;

    const action = getRxUiAction(row.rx);
    const label = action ? getRxUiActionLabel(action) : null;

    if (!action || !label) {
        return <TableCell />;
    }

    return (
        <TableCell>
            <Button
                size="sm"
                onClick={() => onClick?.(row.rx)}
                disabled={disabled || isLoading}
            >
                {isLoading && (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                {label}
            </Button>
        </TableCell>
    );
}