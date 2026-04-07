import { Badge } from "@/components/ui/badge";

import { getRxUiStatus } from "../lib/rx.status-resolver";
import { getRxUiStatusBadge } from "../lib/rx.ui-status-badges";

import type { RxTableRowVm } from "../lib/rx.table-row.vm";

export function RxStatusCell(props: {
    row: RxTableRowVm;
}) {
    const { row } = props;

    const uiStatus = getRxUiStatus(row.rx);
    const badge = getRxUiStatusBadge(uiStatus);

    return (
        <td className="whitespace-nowrap">
            <Badge className={badge.className}>
                {badge.label}
            </Badge>
        </td>
    );
}