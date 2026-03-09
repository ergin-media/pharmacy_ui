import { TableHead, TableRow } from "@/components/ui/table";
import {
    hasRxTableColumn,
    type RxTableColumnKey,
} from "../lib/rx.table-columns";

export function RxListTableHeader(props: { columns: RxTableColumnKey[] }) {
    const { columns } = props;

    return (
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
                <TableHead className="w-35 text-right">Gesamtmenge</TableHead>
            )}

            {hasRxTableColumn(columns, "totalPrice") && (
                <TableHead className="w-40 text-right">Gesamtpreis</TableHead>
            )}

            {hasRxTableColumn(columns, "receivedAt") && (
                <TableHead className="w-42.5">Eingang</TableHead>
            )}

            {hasRxTableColumn(columns, "status") && (
                <TableHead className="w-42">Status</TableHead>
            )}

            {hasRxTableColumn(columns, "offerCreatedAt") && (
                <TableHead className="w-42.5">Angebot erstellt</TableHead>
            )}

            {hasRxTableColumn(columns, "paidAt") && (
                <TableHead className="w-42.5">Bezahlt am</TableHead>
            )}

            {hasRxTableColumn(columns, "fulfillmentType") && (
                <TableHead className="w-30">Fulfillment</TableHead>
            )}

            {hasRxTableColumn(columns, "preparedAt") && (
                <TableHead className="w-42.5">Vorbereitet am</TableHead>
            )}

            {hasRxTableColumn(columns, "pickupReadyAt") && (
                <TableHead className="w-42.5">Abholbereit seit</TableHead>
            )}

            {hasRxTableColumn(columns, "completedAt") && (
                <TableHead className="w-42.5">Abgeschlossen am</TableHead>
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
                <TableHead className="w-24 text-right pe-3">Mehr</TableHead>
            )}
        </TableRow>
    );
}
