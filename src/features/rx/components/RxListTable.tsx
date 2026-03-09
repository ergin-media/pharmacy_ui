import type { RxListItemDto, RxParseStatus } from "../types/rx.dto";
import type { RxQueue } from "../lib/rx.queues";
import { workflowBadgeVariant, paymentBadgeVariant } from "../lib/rx.badges";
import { workflowLabel, paymentLabel, orderLabel } from "../lib/rx.labels";
import { getPriceMeta } from "../lib/rx.summary";
import { getRxTableColumns, hasRxTableColumn } from "../lib/rx.table-columns";

import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { formatDateTime } from "@/shared/lib/format/date";
import { formatMoney } from "@/shared/lib/format/money";
import { formatPersonName } from "@/shared/lib/format/person";
import { formatQuantity } from "@/shared/lib/format/quantity";

import { RxListTableSkeleton } from "./RxListTableSkeleton";
import { RxRowActionsMenu } from "./RxRowActionsMenu";

import { Button } from "@/components/ui/button";
import { Loader2, RotateCcw } from "lucide-react";
import { RxItemsTableCell } from "./RxItemsTableCell";

import { rxShouldShowReparse, rxUnmappedCount } from "../lib/rx.reparse";

function formatOptionalDate(value?: string | null) {
    return value ? formatDateTime(value) : "—";
}

function getFulfillmentTypeLabel(rx: RxListItemDto) {
    const type = rx.fulfillment_type ?? rx.summary?.fulfillment_type ?? null;

    if (type === "shipping") return "Versand";
    if (type === "pickup") return "Abholung";

    return "—";
}

function getIssueLabel(rx: RxListItemDto, unmappedCount: number) {
    if (unmappedCount > 0) return `${unmappedCount} Artikel unmapped`;

    if (rx.parse?.flags?.pricing_base_price_missing) {
        return "Grundpreis fehlt";
    }

    if (rx.parse?.actions?.can_reparse) {
        return "Prüfung erforderlich";
    }

    if (rx.parse_status === "failed") {
        return "Parsing fehlgeschlagen";
    }

    if (rx.parse_status === "parsed_with_warnings") {
        return "Warnungen vorhanden";
    }

    return "Klärung erforderlich";
}

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
    } = props;

    const columns = getRxTableColumns(queue);
    const baseIndex = Math.max(0, (page - 1) * perPage);

    return (
        <div className="overflow-x-auto rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {hasRxTableColumn(columns, "index") && (
                            <TableHead className="w-14 ps-3">#</TableHead>
                        )}

                        {hasRxTableColumn(columns, "patient") && (
                            <TableHead className="w-65">Patient</TableHead>
                        )}

                        {hasRxTableColumn(columns, "provider") && (
                            <TableHead className="w-55">Plattform</TableHead>
                        )}

                        {hasRxTableColumn(columns, "items") && (
                            <TableHead>Artikel</TableHead>
                        )}

                        {hasRxTableColumn(columns, "totalQty") && (
                            <TableHead className="w-35 text-right">
                                Gesamtmenge
                            </TableHead>
                        )}

                        {hasRxTableColumn(columns, "totalPrice") && (
                            <TableHead className="w-40 text-right">
                                Gesamtpreis
                            </TableHead>
                        )}

                        {hasRxTableColumn(columns, "receivedAt") && (
                            <TableHead className="w-42.5">Eingang</TableHead>
                        )}

                        {hasRxTableColumn(columns, "status") && (
                            <TableHead className="w-42">Status</TableHead>
                        )}

                        {hasRxTableColumn(columns, "offerCreatedAt") && (
                            <TableHead className="w-42.5">
                                Angebot erstellt
                            </TableHead>
                        )}

                        {hasRxTableColumn(columns, "paidAt") && (
                            <TableHead className="w-42.5">Bezahlt am</TableHead>
                        )}

                        {hasRxTableColumn(columns, "fulfillmentType") && (
                            <TableHead className="w-30">Fulfillment</TableHead>
                        )}

                        {hasRxTableColumn(columns, "preparedAt") && (
                            <TableHead className="w-42.5">
                                Vorbereitet am
                            </TableHead>
                        )}

                        {hasRxTableColumn(columns, "pickupReadyAt") && (
                            <TableHead className="w-42.5">
                                Abholbereit seit
                            </TableHead>
                        )}

                        {hasRxTableColumn(columns, "completedAt") && (
                            <TableHead className="w-42.5">
                                Abgeschlossen am
                            </TableHead>
                        )}

                        {hasRxTableColumn(columns, "issue") && (
                            <TableHead className="w-48">Problem</TableHead>
                        )}

                        {hasRxTableColumn(columns, "primaryAction") && (
                            <TableHead className="w-44 text-right">
                                Nächster Schritt
                            </TableHead>
                        )}

                        {hasRxTableColumn(columns, "moreActions") && (
                            <TableHead className="w-24 text-right pe-3">
                                Mehr
                            </TableHead>
                        )}
                    </TableRow>
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
                        items.map((r, idx) => {
                            const rowId = Number(r.id);
                            const isReparseBusy =
                                reparseBusyId != null &&
                                Number(reparseBusyId) === rowId;

                            const rowNumber = baseIndex + idx + 1;

                            const summary = r.summary ?? undefined;
                            const priceMeta = getPriceMeta(summary);

                            const unmappedCount = rxUnmappedCount(r);
                            const showReparse =
                                Boolean(onReparse) &&
                                rxShouldShowReparse(r, unmappedCount);

                            const totalQty = summary?.total_quantity ?? null;
                            const totalUnit = summary?.total_unit ?? null;

                            const priceCents =
                                summary?.final_price_cents ?? null;
                            const currency = summary?.currency ?? "EUR";

                            const patientTitle = formatPersonName(
                                r.patient?.first_name,
                                r.patient?.last_name,
                            );
                            const patientSub =
                                r.patient?.email ?? r.patient?.phone ?? "—";

                            return (
                                <TableRow
                                    key={r.id}
                                    className="hover:bg-muted/50"
                                >
                                    {hasRxTableColumn(columns, "index") && (
                                        <TableCell className="ps-3 text-muted-foreground">
                                            {`${rowNumber}.`}
                                        </TableCell>
                                    )}

                                    {hasRxTableColumn(columns, "patient") && (
                                        <TableCell>
                                            <div className="font-medium">
                                                {patientTitle}
                                            </div>
                                            <div className="max-w-60 truncate text-xs text-muted-foreground">
                                                {`ID: ${r.id} | ${patientSub}`}
                                            </div>
                                        </TableCell>
                                    )}

                                    {hasRxTableColumn(columns, "provider") && (
                                        <TableCell>
                                            <div className="max-w-50 truncate font-medium">
                                                {r.provider?.name ??
                                                    r.provider?.slug ??
                                                    "—"}
                                            </div>
                                            <div className="max-w-50 truncate text-xs text-muted-foreground">
                                                {orderLabel(
                                                    r.external_order_id,
                                                )}
                                            </div>
                                        </TableCell>
                                    )}

                                    {hasRxTableColumn(columns, "items") && (
                                        <RxItemsTableCell
                                            rx={r}
                                            rxItems={r.items ?? []}
                                            unmappedCount={unmappedCount}
                                            priceMeta={priceMeta}
                                        />
                                    )}

                                    {hasRxTableColumn(columns, "totalQty") && (
                                        <TableCell className="text-right">
                                            <div className="font-medium">
                                                {formatQuantity(
                                                    totalQty,
                                                    totalUnit,
                                                )}
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
                                                        priceMeta.isComplete
                                                            ? ""
                                                            : "text-muted-foreground opacity-50",
                                                    ].join(" ")}
                                                >
                                                    {formatMoney(
                                                        priceCents,
                                                        currency,
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    )}

                                    {hasRxTableColumn(
                                        columns,
                                        "receivedAt",
                                    ) && (
                                        <TableCell className="whitespace-nowrap">
                                            {formatOptionalDate(
                                                r.mail?.received_at,
                                            )}
                                        </TableCell>
                                    )}

                                    {hasRxTableColumn(columns, "status") && (
                                        <TableCell>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge
                                                        variant={workflowBadgeVariant(
                                                            r.workflow_status,
                                                        )}
                                                    >
                                                        {workflowLabel(
                                                            r.workflow_status,
                                                        )}
                                                    </Badge>

                                                    <Badge
                                                        variant={paymentBadgeVariant(
                                                            r.payment_state,
                                                        )}
                                                    >
                                                        {paymentLabel(
                                                            r.payment_state,
                                                        )}
                                                    </Badge>
                                                </div>

                                                <div className="text-xs text-muted-foreground">
                                                    <span className="font-medium text-foreground">
                                                        {
                                                            r.parse_status as RxParseStatus
                                                        }
                                                    </span>
                                                </div>

                                                {showReparse ? (
                                                    <div>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-7 px-2"
                                                            onClick={() =>
                                                                onReparse?.(
                                                                    rowId,
                                                                )
                                                            }
                                                            disabled={
                                                                Boolean(
                                                                    isLoading,
                                                                ) ||
                                                                isReparseBusy
                                                            }
                                                        >
                                                            {isReparseBusy ? (
                                                                <Loader2 className="mr-2 size-4 animate-spin" />
                                                            ) : (
                                                                <RotateCcw className="mr-2 size-4" />
                                                            )}
                                                            Reparse
                                                        </Button>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </TableCell>
                                    )}

                                    {hasRxTableColumn(
                                        columns,
                                        "offerCreatedAt",
                                    ) && (
                                        <TableCell className="whitespace-nowrap">
                                            {formatOptionalDate(
                                                r.offer_created_at,
                                            )}
                                        </TableCell>
                                    )}

                                    {hasRxTableColumn(columns, "paidAt") && (
                                        <TableCell className="whitespace-nowrap">
                                            {formatOptionalDate(r.paid_at)}
                                        </TableCell>
                                    )}

                                    {hasRxTableColumn(
                                        columns,
                                        "fulfillmentType",
                                    ) && (
                                        <TableCell>
                                            {getFulfillmentTypeLabel(r)}
                                        </TableCell>
                                    )}

                                    {hasRxTableColumn(
                                        columns,
                                        "preparedAt",
                                    ) && (
                                        <TableCell className="whitespace-nowrap">
                                            {formatOptionalDate(r.prepared_at)}
                                        </TableCell>
                                    )}

                                    {hasRxTableColumn(
                                        columns,
                                        "pickupReadyAt",
                                    ) && (
                                        <TableCell className="whitespace-nowrap">
                                            {formatOptionalDate(
                                                r.pickup_ready_at,
                                            )}
                                        </TableCell>
                                    )}

                                    {hasRxTableColumn(
                                        columns,
                                        "completedAt",
                                    ) && (
                                        <TableCell className="whitespace-nowrap">
                                            {formatOptionalDate(r.completed_at)}
                                        </TableCell>
                                    )}

                                    {hasRxTableColumn(columns, "issue") && (
                                        <TableCell>
                                            <div className="text-sm">
                                                {getIssueLabel(
                                                    r,
                                                    unmappedCount,
                                                )}
                                            </div>
                                        </TableCell>
                                    )}

                                    {hasRxTableColumn(
                                        columns,
                                        "primaryAction",
                                    ) && (
                                        <TableCell className="text-right">
                                            <div className="flex justify-end">
                                                <Button
                                                    size="sm"
                                                    disabled={
                                                        Boolean(isLoading) ||
                                                        isReparseBusy
                                                    }
                                                >
                                                    TODO
                                                </Button>
                                            </div>
                                        </TableCell>
                                    )}

                                    {hasRxTableColumn(
                                        columns,
                                        "moreActions",
                                    ) && (
                                        <TableCell className="text-right pe-3">
                                            <div className="flex justify-end">
                                                <RxRowActionsMenu
                                                    disabled={
                                                        Boolean(isLoading) ||
                                                        isReparseBusy
                                                    }
                                                    onOpen={() =>
                                                        onOpen?.(rowId)
                                                    }
                                                    onPdf={() => onPdf?.(rowId)}
                                                    onMore={() =>
                                                        onMore?.(rowId)
                                                    }
                                                    onCreateInvoice={() =>
                                                        onCreateInvoice?.(rowId)
                                                    }
                                                />
                                            </div>
                                        </TableCell>
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
