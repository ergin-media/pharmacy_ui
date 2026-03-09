import { TableCell } from "@/components/ui/table";
import type { RxTableRowVm } from "../lib/rx.table-row.vm";

export function RxPatientCell(props: { row: RxTableRowVm }) {
    const { row } = props;

    return (
        <TableCell>
            <div className="font-medium">{row.patientTitle}</div>
            <div className="max-w-60 truncate text-xs text-muted-foreground">
                {row.patientSub}
            </div>
        </TableCell>
    );
}
