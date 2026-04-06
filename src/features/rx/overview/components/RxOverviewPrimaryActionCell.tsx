import { TableCell } from "@/components/ui/table";
import { LoadingButton } from "@/components/ui/loading-button";

import type { RxListItemDto } from "../../types/rx.dto";
import type { RxTableRowVm } from "../../lib/rx.table-row.vm";
import { getRxOverviewStatus } from "../lib/rx-overview.status";

function getPrimaryActionLabel(rx: RxListItemDto): string | null {
    const status = getRxOverviewStatus(rx);

    switch (status) {
        case "offer_required":
            return "Angebot erstellen";
        case "paid":
            return "In Bearbeitung";
        default:
            return null;
    }
}

export function RxOverviewPrimaryActionCell(props: {
    row: RxTableRowVm;
    isLoading?: boolean;
    disabled?: boolean;
    onClick?: (rx: RxListItemDto) => void;
}) {
    const { row, isLoading, disabled, onClick } = props;

    const label = getPrimaryActionLabel(row.rx);

    return (
        <TableCell className="text-right">
            {label ? (
                <div className="flex justify-end">
                    <LoadingButton
                        size="sm"
                        loading={isLoading}
                        disabled={disabled}
                        onClick={() => onClick?.(row.rx)}
                    >
                        {label}
                    </LoadingButton>
                </div>
            ) : (
                <div className="text-sm text-muted-foreground">—</div>
            )}
        </TableCell>
    );
}