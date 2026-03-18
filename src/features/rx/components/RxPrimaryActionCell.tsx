import { TableCell } from "@/components/ui/table";
import { LoadingButton } from "@/components/ui/loading-button";

import type { RxTableRowVm } from "../lib/rx.table-row.vm";
import type { RxListItemDto } from "../types/rx.dto";
import { RxMarkPaidPopover } from "../mark-paid/components/RxMarkPaidPopover";

export function RxPrimaryActionCell(props: {
    row: RxTableRowVm;
    disabled?: boolean;
    isLoading?: boolean;
    onClick?: (rx: RxListItemDto) => void;
}) {
    const { row, disabled, isLoading, onClick } = props;

    return (
        <TableCell className="text-right">
            {row.primaryActionLabel ? (
                <div className="flex justify-end">
                    {row.queue === "await_payment" ? (
                        <RxMarkPaidPopover
                            rxId={row.id}
                            disabled={disabled || isLoading}
                            triggerLabel={row.primaryActionLabel}
                        />
                    ) : (
                        <LoadingButton
                            size="sm"
                            loading={isLoading}
                            disabled={disabled}
                            onClick={() => onClick?.(row.rx)}
                        >
                            {row.primaryActionLabel}
                        </LoadingButton>
                    )}
                </div>
            ) : null}
        </TableCell>
    );
}
