import type { ProviderProductMapDto } from "../types/provider-products.dto";
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
import { ProviderProductsListTableSkeleton } from "./ProviderProductsListTableSkeleton";
import { ProviderProductRowActionsMenu } from "./ProviderProductRowActionsMenu";

export function ProviderProductsListTable(props: {
    items: ProviderProductMapDto[];
    isLoading?: boolean;
    perPage: number;
    onManageMapping?: (row: ProviderProductMapDto) => void;
    onRemoveMapping?: (row: ProviderProductMapDto) => void;
}) {
    const { items, isLoading, perPage, onManageMapping, onRemoveMapping } =
        props;

    return (
        <div className="overflow-x-auto rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="ps-3">Provider</TableHead>
                        <TableHead>Externer Name</TableHead>
                        <TableHead className="w-32">Status</TableHead>
                        <TableHead className="w-52">Usage</TableHead>
                        <TableHead className="w-52">Updated</TableHead>
                        <TableHead className="w-24 text-right pe-3">
                            Aktionen
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        <ProviderProductsListTableSkeleton rows={perPage} />
                    ) : items.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={6}
                                className="text-muted-foreground"
                            >
                                Keine Ergebnisse.
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((row) => (
                            <TableRow
                                key={row.id}
                                className="hover:bg-muted/50"
                            >
                                <TableCell className="ps-3">
                                    <div className="font-medium">
                                        {row.provider.name ??
                                            row.provider.slug ??
                                            "—"}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        ID: {row.provider.id}
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <div className="font-medium">
                                        {row.external.name_raw ?? "—"}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {row.external.name_norm ?? "—"}
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <Badge
                                        variant={
                                            row.is_mapped
                                                ? "success"
                                                : "secondary"
                                        }
                                    >
                                        {row.is_mapped ? "Gemappt" : "Offen"}
                                    </Badge>
                                </TableCell>

                                <TableCell>
                                    <div className="font-medium">
                                        {row.usage?.count ?? 0}×
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        zuletzt:{" "}
                                        {formatDateTime(
                                            row.usage?.last_used_at,
                                        )}
                                    </div>
                                </TableCell>

                                <TableCell className="text-muted-foreground whitespace-nowrap">
                                    {formatDateTime(
                                        row.updated_at ?? row.created_at,
                                    )}
                                </TableCell>

                                <TableCell className="sticky right-0 text-right pe-3">
                                    <div className="flex justify-end">
                                        <ProviderProductRowActionsMenu
                                            disabled={isLoading}
                                            isMapped={row.is_mapped}
                                            onManageMapping={() =>
                                                onManageMapping?.(row)
                                            }
                                            onRemoveMapping={() =>
                                                onRemoveMapping?.(row)
                                            }
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
