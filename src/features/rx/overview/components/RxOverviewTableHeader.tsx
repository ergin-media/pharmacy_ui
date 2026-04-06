import {
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { RxOverviewColumnKey } from "../lib/rx-overview.columns";

function getColumnLabel(column: RxOverviewColumnKey) {
    switch (column) {
        case "index":
            return "#";
        case "patient":
            return "Patient";
        case "provider":
            return "Provider";
        case "items":
            return "Artikel";
        case "totalQty":
            return "Menge";
        case "totalPrice":
            return "Gesamtpreis";
        case "receivedAt":
            return "Eingang";
        case "status":
            return "Status";
        case "primaryAction":
            return "Aktion";
        case "moreActions":
            return "";
        default:
            return "";
    }
}

export function RxOverviewTableHeader(props: {
    columns: RxOverviewColumnKey[];
}) {
    const { columns } = props;

    return (
        <TableHeader>
            <TableRow>
                {columns.map((column) => (
                    <TableHead
                        key={column}
                        className={column === "moreActions" ? "text-right" : undefined}
                    >
                        {getColumnLabel(column)}
                    </TableHead>
                ))}
            </TableRow>
        </TableHeader>
    );
}