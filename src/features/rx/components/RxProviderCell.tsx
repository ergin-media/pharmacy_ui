import { TableCell } from "@/components/ui/table";
import { orderLabel } from "../lib/rx.labels";
import type { RxTableRowVm } from "../lib/rx.table-row.vm";

export function RxProviderCell(props: { row: RxTableRowVm }) {
    const { row } = props;

    return (
        <TableCell>
            <div className="max-w-50 truncate font-medium">
                {row.providerTitle}
            </div>
            <div className="max-w-50 truncate text-xs text-muted-foreground">
                {orderLabel(row.rx.external_order_id)}
            </div>
        </TableCell>
    );
}
