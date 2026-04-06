import type { RxListItemDto } from "../../types/rx.dto";
import { mapRxListItemToRowVm } from "../../lib/rx.table-row.vm";

import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table";

import { RelativeDateTime } from "@/shared/ui/RelativeDateTime";

import { RxPatientCell } from "../../components/RxPatientCell";
import { RxProviderCell } from "../../components/RxProviderCell";
import { RxItemsTableCell } from "../../components/RxItemsTableCell";
import { RxMoreActionsCell } from "../../components/RxMoreActionsCell";
import { RxOverviewTableHeader } from "./RxOverviewTableHeader";
import { RX_OVERVIEW_COLUMNS } from "../lib/rx-overview.columns";
import { RxOverviewStatusCell } from "./RxOverviewStatusCell";
import { RxOverviewPrimaryActionCell } from "./RxOverviewPrimaryActionCell";

export function RxOverviewTable(props: {
    items: RxListItemDto[];
    isLoading?: boolean;
    page: number;
    perPage: number;
    activeActionId?: number | null;
    onPrimaryAction?: (rx: RxListItemDto) => void;
}) {
    const {
        items,
        isLoading,
        page,
        perPage,
        activeActionId,
        onPrimaryAction,
    } = props;

    const columns = RX_OVERVIEW_COLUMNS;

    return (
        <div className="overflow-x-auto rounded-md border transition-opacity">
            <Table>
                <RxOverviewTableHeader columns={columns} />

                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="text-muted-foreground"
                            >
                                Lade…
                            </TableCell>
                        </TableRow>
                    ) : items.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="text-muted-foreground"
                            >
                                Keine Ergebnisse.
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((rx, idx) => {
                            const row = mapRxListItemToRowVm({
                                rx,
                                queue: "all",
                                rowIndex: idx,
                                page,
                                perPage,
                            });

                            const rowIsPrimaryActionBusy =
                                activeActionId != null &&
                                activeActionId === row.id;

                            return (
                                <TableRow
                                    key={row.id}
                                    className="hover:bg-muted/50"
                                >
                                    <TableCell className="ps-3 text-muted-foreground">
                                        {`${row.rowNumber}.`}
                                    </TableCell>

                                    <RxPatientCell row={row} />

                                    <RxProviderCell row={row} />

                                    <RxItemsTableCell
                                        rx={row.rx}
                                        rxItems={row.rx.items ?? []}
                                        unmappedCount={row.unmappedCount}
                                        priceMeta={row.priceMeta}
                                    />

                                    <TableCell className="text-right">
                                        <div className="font-medium">
                                            {row.totalQtyLabel}
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <div className="flex flex-col items-end">
                                            <div
                                                className={[
                                                    "font-medium",
                                                    row.totalPriceDimmed
                                                        ? "text-muted-foreground opacity-50"
                                                        : "",
                                                ].join(" ")}
                                            >
                                                {row.totalPriceLabel}
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="whitespace-nowrap">
                                        <RelativeDateTime
                                            value={row.receivedAtLabel}
                                        />
                                    </TableCell>

                                    <RxOverviewStatusCell row={row} />

                                    <RxOverviewPrimaryActionCell
                                        row={row}
                                        isLoading={rowIsPrimaryActionBusy}
                                        onClick={onPrimaryAction}
                                    />

                                    <RxMoreActionsCell
                                        row={row}
                                        open={() => { }}
                                        pdf={() => { }}
                                        more={() => { }}
                                        createInvoice={() => { }}
                                    />
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
}