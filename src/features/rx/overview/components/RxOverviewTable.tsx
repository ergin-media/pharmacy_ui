import type { RxListItemDto } from "../../types/rx.dto";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getRxOverviewStatus, getRxOverviewStatusLabel, getRxOverviewStatusVariant } from "../lib/rx-overview.status";
import { Badge } from "@/components/ui/badge";

export function RxOverviewTable(props: {
    items: RxListItemDto[];
    isLoading?: boolean;
}) {
    const { items, isLoading } = props;

    return (
        <div className="overflow-x-auto rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableCell>Patient</TableCell>
                        <TableCell>Provider</TableCell>
                        <TableCell>Artikel</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Aktion</TableCell>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={5}>Lade…</TableCell>
                        </TableRow>
                    ) : items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5}>
                                Keine Ergebnisse.
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((rx) => {
                            const status = getRxOverviewStatus(rx);

                            return (
                                <TableRow key={rx.id}>
                                    <TableCell>
                                        {[rx.patient?.first_name, rx.patient?.last_name]
                                            .filter(Boolean)
                                            .join(" ") || "—"}
                                    </TableCell>

                                    <TableCell>
                                        {rx.provider?.name ?? rx.provider?.slug ?? "—"}
                                    </TableCell>

                                    <TableCell>
                                        {rx.items?.length ?? 0} Artikel
                                    </TableCell>

                                    <TableCell>
                                        <Badge variant={getRxOverviewStatusVariant(status)}>
                                            {getRxOverviewStatusLabel(status)}
                                        </Badge>
                                    </TableCell>

                                    <TableCell>—</TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
}