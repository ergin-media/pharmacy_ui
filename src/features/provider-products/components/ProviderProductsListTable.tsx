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
import { ProviderProductMappingCell } from "./ProviderProductMappingCell";

export function ProviderProductsListTable(props: {
    items: ProviderProductMapDto[];
    isLoading?: boolean;
    perPage: number;

    disableControls?: boolean;
    busyRowIds?: number[];

    onSetMapping: (
        row: ProviderProductMapDto,
        pharmacyProductId: number | null,
    ) => void;

    onManageMapping?: (row: ProviderProductMapDto) => void;
    onRemoveMapping?: (row: ProviderProductMapDto) => void;
}) {
    const {
        items,
        isLoading = false,
        perPage,
        disableControls = false,
        busyRowIds = [],
        onSetMapping,
        onManageMapping,
        onRemoveMapping,
    } = props;

    const tableBusy = isLoading;

    return (
        <div className="overflow-x-auto rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="ps-3">Plattform</TableHead>
                        <TableHead>Externer Name</TableHead>
                        <TableHead className="w-80">Zuordnung</TableHead>
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
                                colSpan={7}
                                className="text-muted-foreground"
                            >
                                Keine Ergebnisse.
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((row) => {
                            const rowBusy =
                                tableBusy ||
                                disableControls ||
                                busyRowIds.includes(row.id);

                            return (
                                <TableRow
                                    key={row.id}
                                    className="hover:bg-muted/50"
                                >
                                    <TableCell className="ps-3">
                                        <div className="font-medium">
                                            {row.provider.name ?? "—"}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="font-medium">
                                            {row.external.name_raw ?? "—"}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <ProviderProductMappingCell
                                            row={row}
                                            isLoading={rowBusy}
                                            onSelect={(pid) =>
                                                onSetMapping(row, pid)
                                            }
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <Badge
                                            variant={
                                                row.is_mapped
                                                    ? "success"
                                                    : "danger"
                                            }
                                        >
                                            {row.is_mapped
                                                ? "Gemappt"
                                                : "Offen"}
                                        </Badge>
                                    </TableCell>

                                    <TableCell>
                                        <div className="font-medium">
                                            {row.usage?.count ?? 0}×
                                        </div>
                                        {row.usage?.last_used_at ? (
                                            <div className="text-xs text-muted-foreground">
                                                zuletzt{" "}
                                                {formatDateTime(
                                                    row.usage.last_used_at,
                                                )}
                                            </div>
                                        ) : null}
                                    </TableCell>

                                    <TableCell className="text-muted-foreground whitespace-nowrap">
                                        {formatDateTime(
                                            row.updated_at ?? row.created_at,
                                        )}
                                    </TableCell>

                                    <TableCell className="text-right pe-3">
                                        <div className="flex justify-end">
                                            <ProviderProductRowActionsMenu
                                                disabled={
                                                    disableControls || rowBusy
                                                }
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
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
