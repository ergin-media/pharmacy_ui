import type { RxListItemDto } from "../types/rx.dto";
import type { RxRowActions } from "../types/rx.list.vm";
import { getRxTableColumns, hasRxTableColumn } from "../lib/rx.table-columns";
import { mapRxListItemToRowVm } from "../lib/rx.table-row.vm";

import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { RxListTableSkeleton } from "./RxListTableSkeleton";
import { RxItemsTableCell } from "./RxItemsTableCell";
import { RxListTableHeader } from "./RxListTableHeader";
import { RxStatusCell } from "./RxStatusCell";
import { RxPrimaryActionCell } from "./RxPrimaryActionCell";
import { RxMoreActionsCell } from "./RxMoreActionsCell";
import { RxPatientCell } from "./RxPatientCell";
import { RxProviderCell } from "./RxProviderCell";
import { RxIssuesCell } from "./RxIssuesCell";
import { RelativeDateTime } from "@/shared/ui/RelativeDateTime";

export function RxListTable(props: {
    items: RxListItemDto[];
    isLoading?: boolean;

    page: number;
    perPage: number;

    onOpen?: RxRowActions["open"];
    onPdf?: RxRowActions["pdf"];
    onMore?: RxRowActions["more"];
    onCreateInvoice?: RxRowActions["createInvoice"];

    onReparse?: (id: number) => void;
    isReparseBusy?: (id: number) => boolean;

    onPrimaryAction?: (rx: RxListItemDto) => void;
    isPrimaryActionPending?: boolean;
    activePrimaryActionId?: number | null;
}) {
    const {
        items,
        isLoading,
        page,
        perPage,
        onOpen,
        onPdf,
        onMore,
        onCreateInvoice,
        onReparse,
        isReparseBusy,
        onPrimaryAction,
        isPrimaryActionPending,
        activePrimaryActionId,
    } = props;

    const columns = getRxTableColumns();

    return (
        <div className="overflow-x-auto rounded-md border transition-opacity">
            <Table>
                <TableHeader>
                    <RxListTableHeader columns={columns} />
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        <RxListTableSkeleton rows={perPage} />
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
                                rowIndex: idx,
                                page,
                                perPage,
                            });

                            const rowIsReparseBusy =
                                isReparseBusy?.(row.id) ?? false;

                            const rowIsPrimaryActionBusy =
                                activePrimaryActionId != null &&
                                activePrimaryActionId === row.id;

                            const isBusy =
                                Boolean(isLoading) ||
                                rowIsReparseBusy ||
                                Boolean(isPrimaryActionPending);

                            return (
                                <TableRow
                                    key={row.id}
                                    className="hover:bg-muted/50"
                                >
                                    {hasRxTableColumn(columns, "index") && (
                                        <TableCell className="ps-3 text-muted-foreground">
                                            {`${row.rowNumber}.`}
                                        </TableCell>
                                    )}

                                    {hasRxTableColumn(columns, "patient") && (
                                        <RxPatientCell row={row} />
                                    )}

                                    {hasRxTableColumn(columns, "provider") && (
                                        <RxProviderCell row={row} />
                                    )}

                                    {hasRxTableColumn(columns, "items") && (
                                        <RxItemsTableCell
                                            rx={row.rx}
                                            rxItems={row.rx.items ?? []}
                                            unmappedCount={row.unmappedCount}
                                            priceMeta={row.priceMeta}
                                        />
                                    )}

                                    {hasRxTableColumn(columns, "totalQty") && (
                                        <TableCell className="text-right">
                                            <div className="font-medium">
                                                {row.totalQtyLabel}
                                            </div>
                                        </TableCell>
                                    )}

                                    {hasRxTableColumn(
                                        columns,
                                        "totalPrice",
                                    ) && (
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
                                    )}

                                    {hasRxTableColumn(
                                        columns,
                                        "receivedAt",
                                    ) && (
                                        <TableCell className="whitespace-nowrap">
                                            <RelativeDateTime
                                                value={row.receivedAtLabel}
                                            />
                                        </TableCell>
                                    )}

                                    {hasRxTableColumn(columns, "status") && (
                                        <RxStatusCell
                                            row={row}
                                            disabled={isBusy}
                                            isReparseBusy={rowIsReparseBusy}
                                            onReparse={onReparse}
                                        />
                                    )}

                                    {hasRxTableColumn(columns, "issue") && (
                                        <RxIssuesCell row={row} />
                                    )}

                                    {hasRxTableColumn(
                                        columns,
                                        "primaryAction",
                                    ) && (
                                        <RxPrimaryActionCell
                                            row={row}
                                            disabled={isBusy}
                                            isLoading={rowIsPrimaryActionBusy}
                                            onClick={onPrimaryAction}
                                        />
                                    )}

                                    {hasRxTableColumn(
                                        columns,
                                        "moreActions",
                                    ) && (
                                        <RxMoreActionsCell
                                            row={row}
                                            disabled={isBusy}
                                            open={onOpen}
                                            pdf={onPdf}
                                            more={onMore}
                                            createInvoice={onCreateInvoice}
                                        />
                                    )}
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
