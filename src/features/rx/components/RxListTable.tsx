import type { RxListItemDto, RxParseStatus } from "../types/rx.dto";
import { badgeVariant } from "../lib/rx.constants";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

function fulfillmentLabel(value?: string | null) {
    switch (value) {
        case "shipping":
            return "Versand";
        case "pickup":
            return "Abholung";
        default:
            return "—";
    }
}

function orderLabel(externalOrderId?: string | null) {
    return externalOrderId ? `Bestellung #${externalOrderId}` : "—";
}

export function RxListTable(props: {
    items: RxListItemDto[];
    isLoading?: boolean;
    perPage: number;
    onOpen?: (id: number) => void;
    onPdf?: (id: number) => void;
    onMore?: (id: number) => void;
}) {
    const { items, isLoading, perPage, onOpen, onPdf, onMore } = props;

    return (
        <div className="overflow-x-auto rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-65">Patient</TableHead>
                        <TableHead className="w-55">Quelle</TableHead>
                        <TableHead>Artikel</TableHead>
                        <TableHead className="w-35 text-right">Menge</TableHead>
                        <TableHead className="w-40 text-right">
                            Finaler Preis
                        </TableHead>
                        <TableHead className="w-[170px]">Eingang</TableHead>
                        <TableHead className="w-35">Status</TableHead>
                        <TableHead className="w-45 text-right sticky right-0 bg-background">
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
                            const summary = r.summary ?? undefined;

                            const itemsPreview = summary?.items_preview ?? [];
                            const itemsCount =
                                typeof summary?.items_count === "number"
                                    ? summary.items_count
                                    : itemsPreview.length;

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
                                    {/* Patient */}
                                    <TableCell>
                                        <div className="font-medium">
                                            {patientTitle}
                                        </div>

                                        <div className="max-w-60 truncate text-xs text-muted-foreground">
                                            {patientSub}
                                        </div>
                                    </TableCell>

                                    {/* Quelle */}
                                    <TableCell>
                                        <div className="font-medium truncate max-w-50">
                                            {r.provider?.name ??
                                                r.provider?.slug ??
                                                "—"}
                                        </div>

                                        <div className="max-w-50 truncate text-xs text-muted-foreground">
                                            {orderLabel(r.external_order_id)}{" "}
                                            <span className="text-muted-foreground">
                                                •{" "}
                                                {fulfillmentLabel(
                                                    r.fulfillment_type,
                                                )}
                                            </span>
                                        </div>
                                    </TableCell>

                                    {/* Artikel */}
                                    <TableCell>
                                        {itemsPreview.length > 0 ? (
                                            <div className="min-w-80 space-y-1">
                                                {itemsPreview
                                                    .slice(0, 2)
                                                    .map((it, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex items-center justify-between gap-3"
                                                        >
                                                            <div className="truncate">
                                                                {it.name ?? "—"}
                                                            </div>
                                                            <div className="whitespace-nowrap text-xs text-muted-foreground">
                                                                {formatQuantity(
                                                                    it.quantity,
                                                                    it.unit,
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}

                                                {itemsCount > 2 ? (
                                                    <div className="text-xs text-muted-foreground">
                                                        +{itemsCount - 2}{" "}
                                                        weitere
                                                    </div>
                                                ) : null}
                                            </div>
                                        ) : (
                                            <div className="text-sm text-muted-foreground">
                                                —
                                            </div>
                                        )}
                                    </TableCell>

                                    {/* Menge */}
                                    <TableCell className="text-right">
                                        <div className="font-medium">
                                            {formatQuantity(
                                                totalQty,
                                                totalUnit,
                                            )}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {itemsCount
                                                ? `${itemsCount} Positionen`
                                                : "—"}
                                        </div>
                                    </TableCell>

                                    {/* Finaler Preis */}
                                    <TableCell className="text-right">
                                        <div className="font-medium">
                                            {formatMoney(priceCents, currency)}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            —
                                        </div>
                                    </TableCell>

                                    {/* Eingang */}
                                    <TableCell className="whitespace-nowrap">
                                        <div className="font-medium">
                                            {formatDateTime(
                                                r.mail?.received_at,
                                            )}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {r.mail?.from_email ?? "—"}
                                        </div>
                                    </TableCell>

                                    {/* Status */}
                                    <TableCell>
                                        <Badge
                                            variant={badgeVariant(
                                                r.parse_status as RxParseStatus,
                                            )}
                                        >
                                            {r.parse_status}
                                        </Badge>
                                        {r.parsed_at ? (
                                            <div className="mt-1 text-xs text-muted-foreground">
                                                {formatDateTime(r.parsed_at)}
                                            </div>
                                        ) : null}
                                    </TableCell>

                                    {/* Aktionen */}
                                    <TableCell className="sticky right-0 bg-background text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    onOpen?.(Number(r.id))
                                                }
                                            >
                                                Öffnen
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    onPdf?.(Number(r.id))
                                                }
                                            >
                                                PDF
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    onMore?.(Number(r.id))
                                                }
                                            >
                                                ⋯
                                            </Button>
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
