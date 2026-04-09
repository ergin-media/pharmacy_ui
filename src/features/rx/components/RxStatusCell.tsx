import { Badge } from "@/components/ui/badge";

import type { RxTableRowVm } from "../lib/rx.table-row.vm";
import { getRxUiStatus } from "../lib/rx.ui-status";
import { getRxUiStatusBadge } from "../lib/rx.ui-status-badges";

export function RxStatusCell(props: {
    row: RxTableRowVm;
    disabled?: boolean;
    isReparseBusy?: boolean;
    onReparse?: (id: number) => void;
}) {
    const { row } = props;

    const uiStatus = getRxUiStatus(row.rx);
    const badge = getRxUiStatusBadge(uiStatus);

    return (
        <td className="whitespace-nowrap">
            <Badge className={badge.className}>{badge.label}</Badge>
        </td>
    );
}
