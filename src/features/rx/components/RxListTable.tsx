import type { RxListItemDto, RxParseStatus } from "../types/rx.dto";
import { workflowBadgeVariant, paymentBadgeVariant } from "../lib/rx.badges";
import { workflowLabel, paymentLabel, orderLabel } from "../lib/rx.labels";
import { getPriceMeta } from "../lib/rx.summary";
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

export function RxListTable(props: {
    items: RxListItemDto[];
    isLoading?: boolean;
    perPage: number;
    onOpen?: (id: number) => void;
    onPdf?: (id: number) => void;
    onMore?: (id: number) => void;
    onCreateInvoice?: (id: number) => void;
}) {
    const {
        items,
        isLoading,
        perPage,
        onOpen,
        onPdf,
        onMore,
        onCreateInvoice,
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
                            const summary = r.summary ?? undefined;
                            const priceMeta = getPriceMeta(summary);

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

                                    {/* Artikel */}
                                    <TableCell>
                                        {itemsPreview.length > 0 ? (
                                            <div className="min-w-80 space-y-1">
                                                {itemsPreview
                                                    .slice(0, 3)
                                                    .map((it, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex items-center gap-1"
                                                        >
                                                            <div className="truncate">
                                                                {it.name ? (
                                                                    <>
                                                                        <span className="mr-1 text-muted-foreground">
                                                                            •
                                                                        </span>
                                                                        {
                                                                            it.name
                                                                        }
                                                                    </>
                                                                ) : (
                                                                    "—"
                                                                )}
                                                            </div>
                                                            <div className="whitespace-nowrap text-xs text-muted-foreground">
                                                                (
                                                                {formatQuantity(
                                                                    it.quantity,
                                                                    it.unit,
                                                                )}
                                                                )
                                                            </div>
                                                        </div>
                                                    ))}

                                                {/* Warnzeile für Mapping */}
                                                {!priceMeta.isComplete &&
                                                priceMeta.hint ? (
                                                    <Badge variant={"danger"}>
                                                        {priceMeta.hint}
                                                    </Badge>
                                                ) : null}

                                                {itemsCount > 3 ? (
                                                    <div className="text-xs text-muted-foreground">
                                                        {`+${itemsCount - 3} weitere`}
                                                    </div>
                                                ) : null}
                                            </div>
                                        ) : (
                                            <div className="text-sm text-muted-foreground">
                                                —
                                            </div>
                                        )}
                                    </TableCell>

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

                                    {/* Status */}
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
                                        </div>
                                    </TableCell>

                                    {/* Aktionen */}
                                    <TableCell className="text-right pe-3">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    onCreateInvoice?.(
                                                        Number(r.id),
                                                    )
                                                }
                                            >
                                                Rechnung
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
