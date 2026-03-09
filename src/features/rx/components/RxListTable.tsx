import type { RxListItemDto } from "../types/rx.dto";
import type { RxQueue } from "../lib/rx.queues";
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

export function RxListTable(props: {
    queue: RxQueue;
    items: RxListItemDto[];
    isLoading?: boolean;

    page: number;
    perPage: number;

    onOpen?: (id: number) => void;
    onPdf?: (id: number) => void;
    onMore?: (id: number) => void;
    onCreateInvoice?: (id: number) => void;

    onReparse?: (id: number) => void;
    reparseBusyId?: number | null;
    onPrimaryAction?: (id: number) => void;
}) {
    const {
        queue,
        items,
        isLoading,
        page,
        perPage,
        onOpen,
        onPdf,
        onMore,
        onCreateInvoice,
        onReparse,
        reparseBusyId,
        onPrimaryAction,
    } = props;

    const columns = getRxTableColumns(queue);

    return (
        <div className="overflow-x-auto rounded-md border">
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
                                queue,
                                rowIndex: idx,
                                page,
                                perPage,
                            });

                            const isReparseBusy =
                                reparseBusyId != null &&
                                Number(reparseBusyId) === row.id;

                            const isBusy = Boolean(isLoading) || isReparseBusy;

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
                                        <TableCell>
                                            <div className="font-medium">
                                                {row.patientTitle}
                                            </div>
                                            <div className="max-w-60 truncate text-xs text-muted-foreground">
                                                {row.patientSub}
                                            </div>
                                        </TableCell>
                                    )}

                                    {hasRxTableColumn(columns, "provider") && (
                                        <TableCell>
                                            <div className="max-w-50 truncate font-medium">
                                                {row.providerTitle}
                                            </div>
                                            <div className="max-w-50 truncate text-xs text-muted-foreground">
                                                {row.providerSub}
                                            </div>
                                        </TableCell>
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
                                            {row.receivedAtLabel}
                                        </TableCell>
                                    )}

                                    {hasRxTableColumn(columns, "status") && (
                                        <RxStatusCell
                                            row={row}
                                            disabled={isBusy}
                                            isReparseBusy={isReparseBusy}
                                            onReparse={onReparse}
                                        />
                                    )}

                                    {hasRxTableColumn(
                                        columns,
                                        "offerCreatedAt",
                                    ) && (
                                        <TableCell className="whitespace-nowrap">
                                            {row.offerCreatedAtLabel}
                                        </TableCell>
                                    )}

                                    {hasRxTableColumn(columns, "paidAt") && (
                                        <TableCell className="whitespace-nowrap">
                                            {row.paidAtLabel}
                                        </TableCell>
                                    )}

                                    {hasRxTableColumn(
                                        columns,
                                        "fulfillmentType",
                                    ) && (
                                        <TableCell>
                                            {row.fulfillmentTypeLabel}
                                        </TableCell>
                                    )}

                                    {hasRxTableColumn(
                                        columns,
                                        "preparedAt",
                                    ) && (
                                        <TableCell className="whitespace-nowrap">
                                            {row.preparedAtLabel}
                                        </TableCell>
                                    )}

                                    {hasRxTableColumn(
                                        columns,
                                        "pickupReadyAt",
                                    ) && (
                                        <TableCell className="whitespace-nowrap">
                                            {row.pickupReadyAtLabel}
                                        </TableCell>
                                    )}

                                    {hasRxTableColumn(
                                        columns,
                                        "completedAt",
                                    ) && (
                                        <TableCell className="whitespace-nowrap">
                                            {row.completedAtLabel}
                                        </TableCell>
                                    )}

                                    {hasRxTableColumn(columns, "issue") && (
                                        <TableCell>
                                            <div className="text-sm">
                                                {row.issueLabel}
                                            </div>
                                        </TableCell>
                                    )}

                                    {hasRxTableColumn(
                                        columns,
                                        "primaryAction",
                                    ) && (
                                        <RxPrimaryActionCell
                                            row={row}
                                            disabled={isBusy}
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
                                            onOpen={onOpen}
                                            onPdf={onPdf}
                                            onMore={onMore}
                                            onCreateInvoice={onCreateInvoice}
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
