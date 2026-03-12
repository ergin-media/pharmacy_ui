import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import type { RxTableRowVm } from "../lib/rx.table-row.vm";

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
                    <Button
                        size="sm"
                        disabled={disabled}
                        onClick={() => onClick?.(row.id)}
                    >
                        {isLoading ? (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                        ) : null}
                        {row.primaryActionLabel}
                    </Button>
                </div>
            ) : null}
        </TableCell>
    );
}
