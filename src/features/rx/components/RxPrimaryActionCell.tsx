import { TableCell } from "@/components/ui/table";
import { LoadingButton } from "@/components/ui/loading-button";
import { Badge } from "@/components/ui/badge";

import type { RxTableRowVm } from "../lib/rx.table-row.vm";
import type { RxListItemDto } from "../types/rx.dto";
import { getRxUiStatus } from "../lib/rx.ui-status";
import { getRxUiAction, getRxUiActionLabel } from "../lib/rx.actions";

export function RxPrimaryActionCell(props: {
    row: RxTableRowVm;
    disabled?: boolean;
    isLoading?: boolean;
    onClick?: (rx: RxListItemDto) => void;
    onMarkShippingReady?: (rx: RxListItemDto) => void;
    onMarkPickupReady?: (rx: RxListItemDto) => void;
}) {
    const {
        row,
        disabled,
        isLoading,
        onClick,
        onMarkShippingReady,
        onMarkPickupReady,
    } = props;

    const uiStatus = getRxUiStatus(row.rx);
    const action = getRxUiAction(row.rx);
    const label = action ? getRxUiActionLabel(action) : null;

    const suggestedFulfillment =
        row.rx.fulfillment_type === "shipping"
            ? "Versand"
            : row.rx.fulfillment_type === "pickup"
              ? "Abholung"
              : null;

    if (uiStatus === "paid") {
        return (
            <TableCell className="text-right">
                <div className="flex flex-col items-end gap-2">
                    {suggestedFulfillment ? (
                        <Badge variant="outline">
                            Wunsch laut Plattform: {suggestedFulfillment}
                        </Badge>
                    ) : null}

                    <div className="flex flex-wrap justify-end gap-2">
                        <LoadingButton
                            size="sm"
                            loading={isLoading}
                            disabled={disabled}
                            onClick={() => onMarkShippingReady?.(row.rx)}
                        >
                            Versandlabel erstellen
                        </LoadingButton>

                        <LoadingButton
                            size="sm"
                            variant="outline"
                            loading={false}
                            disabled={disabled || isLoading}
                            onClick={() => onMarkPickupReady?.(row.rx)}
                        >
                            Abholnachricht senden
                        </LoadingButton>
                    </div>
                </div>
            </TableCell>
        );
    }

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
            ) : null}
        </TableCell>
    );
}
