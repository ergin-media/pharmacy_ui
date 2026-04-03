import { TableCell } from "@/components/ui/table";
import type { RxTableRowVm } from "../lib/rx.table-row.vm";
import { orderLabel } from "../lib/rx.labels";

export function RxProviderCell(props: { row: RxTableRowVm }) {
    const { row } = props;

    const subLabel =
        row.rx.external_order_id != null
            ? orderLabel(row.rx.external_order_id)
            : row.providerSub;

    return (
        <TableCell>
            <div className="max-w-50 truncate font-medium">
                {row.providerTitle}
            </div>

            {subLabel ? (
                <div className="max-w-50 truncate text-xs text-muted-foreground">
                    {subLabel}
                </div>
            ) : null}
        </TableCell>
    );
}