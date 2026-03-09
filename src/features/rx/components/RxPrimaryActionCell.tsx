import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import type { RxTableRowVm } from "../lib/rx.table-row.vm";

export function RxPrimaryActionCell(props: {
    row: RxTableRowVm;
    disabled?: boolean;
    onClick?: (id: number) => void;
}) {
    const { row, disabled, onClick } = props;

    return (
        <TableCell className="text-right">
            {row.primaryActionLabel ? (
                <div className="flex justify-end">
                    <Button
                        size="sm"
                        disabled={disabled}
                        onClick={() => onClick?.(row.id)}
                    >
                        {row.primaryActionLabel}
                    </Button>
                </div>
            ) : null}
        </TableCell>
    );
}
