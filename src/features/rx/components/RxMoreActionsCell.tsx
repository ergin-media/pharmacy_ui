import { TableCell } from "@/components/ui/table";
import { RxRowActionsMenu } from "./RxRowActionsMenu";
import type { RxTableRowVm } from "../lib/rx.table-row.vm";
import type { RxRowActions } from "../types/rx.list.vm";

type Props = {
    row: RxTableRowVm;
    disabled?: boolean;
} & Partial<RxRowActions>;

export function RxMoreActionsCell(props: Props) {
    const { row, disabled, open, pdf, more, createInvoice } = props;

    return (
        <TableCell className="text-right pe-3">
            <div className="flex justify-end">
                <RxRowActionsMenu
                    disabled={disabled}
                    onOpen={() => open?.(row.rx)}
                    onPdf={() => pdf?.(row.rx)}
                    onMore={() => more?.(row.rx)}
                    onCreateInvoice={() => createInvoice?.(row.rx)}
                />
            </div>
        </TableCell>
    );
}
