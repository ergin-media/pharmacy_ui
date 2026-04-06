import { TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import type { RxTableRowVm } from "../../lib/rx.table-row.vm";
import {
    getRxOverviewStatus,
    getRxOverviewStatusLabel,
    getRxOverviewStatusVariant,
} from "../lib/rx-overview.status";

export function RxOverviewStatusCell(props: { row: RxTableRowVm }) {
    const { row } = props;

    const status = getRxOverviewStatus(row.rx);

    return (
        <TableCell>
            <div className="flex flex-col gap-2">
                <Badge variant={getRxOverviewStatusVariant(status)}>
                    {getRxOverviewStatusLabel(status)}
                </Badge>

                {row.issueMessages.length > 0 ? (
                    <div className="text-xs text-muted-foreground">
                        {row.issueMessages[0]}
                    </div>
                ) : null}
            </div>
        </TableCell>
    );
}