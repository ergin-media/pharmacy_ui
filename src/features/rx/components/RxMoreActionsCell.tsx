import { TableCell } from "@/components/ui/table";
import { RxRowActionsMenu } from "./RxRowActionsMenu";
import type { RxTableRowVm } from "../lib/rx.table-row.vm";

export function RxMoreActionsCell(props: {
    row: RxTableRowVm;
    disabled?: boolean;
    onOpen?: (id: number) => void;
    onPdf?: (id: number) => void;
    onMore?: (id: number) => void;
    onCreateInvoice?: (id: number) => void;
}) {
    const { row, disabled, onOpen, onPdf, onMore, onCreateInvoice } = props;

    return (
        <TableCell className="text-right pe-3">
            <div className="flex justify-end">
                <RxRowActionsMenu
                    disabled={disabled}
                    onOpen={() => onOpen?.(row.id)}
                    onPdf={() => onPdf?.(row.id)}
                    onMore={() => onMore?.(row.id)}
                    onCreateInvoice={() => onCreateInvoice?.(row.id)}
                />
            </div>
        </TableCell>
    );
}
