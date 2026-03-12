import { TableCell } from "@/components/ui/table";
import type { RxTableRowVm } from "../lib/rx.table-row.vm";
import { LoadingButton } from "@/components/ui/loading-button";

export function RxPrimaryActionCell(props: {
    row: RxTableRowVm;
    disabled?: boolean;
    isLoading?: boolean;
    onClick?: (id: number) => void;
}) {
    const { row, disabled, isLoading, onClick } = props;

    return (
        <TableCell className="text-right">
            {row.primaryActionLabel ? (
                <div className="flex justify-end">
                    <LoadingButton
                        size="sm"
                        loading={isLoading}
                        disabled={disabled}
                        onClick={() => onClick?.(row.id)}
                    >
                        {row.primaryActionLabel}
                    </LoadingButton>
                </div>
            ) : null}
        </TableCell>
    );
}
