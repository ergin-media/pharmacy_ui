import { TableCell } from "@/components/ui/table";
import { LoadingButton } from "@/components/ui/loading-button";

import type { RxTableRowVm } from "../lib/rx.table-row.vm";
import type { RxListItemDto } from "../types/rx.dto";
import {
    getRxUiAction,
    getRxUiActionLabel,
} from "../lib/rx.actions";

export function RxPrimaryActionCell(props: {
    row: RxTableRowVm;
    disabled?: boolean;
    isLoading?: boolean;
    onClick?: (rx: RxListItemDto) => void;
}) {
    const { row, disabled, isLoading, onClick } = props;

    const action = getRxUiAction(row.rx);
    const label = action ? getRxUiActionLabel(action) : null;

    return (
        <TableCell className="text-right">
            {label ? (
                <div className="flex justify-end">
                    <LoadingButton
                        size="sm"
                        loading={isLoading}
                        disabled={disabled}
                        onClick={() => onClick?.(row.rx)}
                    >
                        {label}
                    </LoadingButton>
                </div>
            ) : null}
        </TableCell>
    );
}