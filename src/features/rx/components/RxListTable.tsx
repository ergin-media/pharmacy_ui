import type { RxListItemDto, RxParseStatus } from "../types/rx.dto";
import { workflowBadgeVariant, paymentBadgeVariant } from "../lib/rx.badges";
import { workflowLabel, paymentLabel, orderLabel } from "../lib/rx.labels";
import { getPriceMeta } from "../lib/rx.summary";

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

/**
 * Mapping helpers (neu: items[] kommt direkt von API)
 */
function rxItemHasMapping(item: {
    mapping?: {
        pharmacy_product_id?: number | null;
        has_pharmacy_product?: boolean | 0 | 1 | null;
    } | null;
}): boolean {
    const v = item?.mapping?.has_pharmacy_product;
    if (v === true || v === 1) return true;
    if (v === false || v === 0) return false;
    return Boolean(item?.mapping?.pharmacy_product_id);
}

function rxItemLabel(item: {
    raw_product_name?: string | null;
    normalized_product_name?: string | null;
}): string {
    return item.raw_product_name ?? item.normalized_product_name ?? "—";
}

function rxUnmappedCount(r: RxListItemDto): number {
    // wenn Backend es liefert, nehmen wir das (ist am günstigsten)
    if (typeof r.summary?.unmapped_items_count === "number") {
        return r.summary.unmapped_items_count;
    }
    const its = (r as any).items as Array<any> | undefined;
    if (!Array.isArray(its)) return 0;
    return its.filter((it) => !rxItemHasMapping(it)).length;
}

export function RxListTable(props: {
    items: RxListItemDto[];
    isLoading?: boolean;
    perPage: number;
    onOpen?: (id: number) => void;
    onPdf?: (id: number) => void;
    onMore?: (id: number) => void;
    onCreateInvoice?: (id: number) => void;

    onReparse?: (id: number) => void;
    reparseBusyId?: number | null;
}) {
    const {
        items,
        isLoading,
        perPage,
        onOpen,
        onPdf,
        onMore,
        onCreateInvoice,
        onReparse,
        reparseBusyId,
    } = props;

    return (
        <div className="overflow-x-auto rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-65 ps-3">Patient</TableHead>
                        <TableHead className="w-55">Plattform</TableHead>
                        <TableHead>Artikel</TableHead>
                        <TableHead className="w-35 text-right">
                            Gesamtmenge
                        </TableHead>
                        <TableHead className="w-40 text-right">
                            Gesamtpreis
                        </TableHead>
                        <TableHead className="w-42.5">Eingang</TableHead>
                        <TableHead className="w-35">Status</TableHead>
                        <TableHead className="w-45 text-right pe-3">
                            Aktionen
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        <RxListTableSkeleton rows={perPage} />
                    ) : items.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={8}
                                className="text-muted-foreground"
                            >
                                Keine Ergebnisse.
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((r) => {
                            const rowId = Number(r.id);
                            const isReparseBusy =
                                reparseBusyId != null &&
                                Number(reparseBusyId) === rowId;

                            const summary = r.summary ?? undefined;
                            const priceMeta = getPriceMeta(summary);

                            // ✅ neu: API liefert can_reparse
                            const canReparse =
                                r.parse?.actions?.can_reparse === true;

                            // ✅ neu: Items kommen direkt
                            const rxItems = ((r as any).items ??
                                []) as Array<{
                                    id: number | string;
                                    raw_product_name?: string | null;
                                    normalized_product_name?: string | null;
                                    quantity?: number | null;
                                    unit?: string | null;
                                    mapping?: {
                                        pharmacy_product_id?: number | null;
                                        has_pharmacy_product?: boolean | 0 | 1 | null;
                                    } | null;
                                }>;

                            const itemsCount =
                                typeof summary?.items_count === "number"
                                    ? summary.items_count
                                    : rxItems.length;

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

                            const unmappedCount = rxUnmappedCount(r);

                            // Optional: nur zeigen wenn wirklich nötig (du kannst das weiter anpassen)
                            const needsAttention =
                                (summary?.price_is_complete === false) ||
                                unmappedCount > 0;

                            const showReparse =
                                Boolean(onReparse) && canReparse && needsAttention;

                            return (
                                <TableRow
                                    key={r.id}
                                    className="hover:bg-muted/50"
                                >
                                    {/* Patient */}
                                    <TableCell className="ps-3">
                                        <div className="font-medium">
                                            {patientTitle}
                                        </div>
                                        <div className="max-w-60 truncate text-xs text-muted-foreground">
                                            {patientSub}
                                        </div>
                                    </TableCell>

                                    {/* Plattform */}
                                    <TableCell>
                                        <div className="max-w-50 truncate font-medium">
                                            {r.provider?.name ??
                                                r.provider?.slug ??
                                                "—"}
                                        </div>
                                        <div className="max-w-50 truncate text-xs text-muted-foreground">
                                            {orderLabel(r.external_order_id)}
                                        </div>
                                    </TableCell>

                                    {/* Artikel (neu: aus r.items + mapping indicator) */}
                                    <RxItemsTableCell
                                        rxItems={r.items ?? []}
                                        unmappedCount={r.summary?.unmapped_items_count ?? 0}
                                        priceMeta={priceMeta}
                                    />

                                    {/* Gesamtmenge */}
                                    <TableCell className="text-right">
                                        <div className="font-medium">
                                            {formatQuantity(
                                                totalQty,
                                                totalUnit,
                                            )}
                                        </div>
                                    </TableCell>

                                    {/* Gesamtpreis */}
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

                                    {/* Eingang */}
                                    <TableCell className="whitespace-nowrap">
                                        {formatDateTime(r.mail?.received_at)}
                                    </TableCell>

                                    {/* Status + Reparse */}
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
                                                    {r.parse_status as RxParseStatus}
                                                </span>
                                            </div>

                                            {showReparse ? (
                                                <div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-7 px-2"
                                                        onClick={() =>
                                                            onReparse?.(rowId)
                                                        }
                                                        disabled={
                                                            Boolean(isLoading) ||
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

                                    {/* Aktionen */}
                                    <TableCell className="text-right pe-3">
                                        <div className="flex justify-end">
                                            <RxRowActionsMenu
                                                disabled={
                                                    Boolean(isLoading) ||
                                                    isReparseBusy
                                                }
                                                onOpen={() => onOpen?.(rowId)}
                                                onPdf={() => onPdf?.(rowId)}
                                                onMore={() => onMore?.(rowId)}
                                                onCreateInvoice={() =>
                                                    onCreateInvoice?.(rowId)
                                                }
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
}