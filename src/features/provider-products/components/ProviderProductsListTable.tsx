import type { ProviderProductMapDto } from "../types/provider-products.dto";
import type { PharmacyProductDto } from "@/features/pharmacy-products/types/pharmacy-products.dto";

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
import { ProviderProductMappingCombobox } from "./ProviderProductMappingCombobox";

export function ProviderProductsListTable(props: {
    items: ProviderProductMapDto[];
    isLoading?: boolean;
    perPage: number;

    pharmacyProducts: PharmacyProductDto[];
    pharmacyProductsLoading?: boolean;

    disableControls?: boolean;

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
        pharmacyProducts,
        pharmacyProductsLoading = false,
        disableControls = false,
        onSetMapping,
        onManageMapping,
        onRemoveMapping,
    } = props;

    const tableBusy = isLoading || pharmacyProductsLoading;

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
                        items.map((row) => (
                            <TableRow key={row.id} className="hover:bg-muted/50">
                                {/* Plattform */}
                                <TableCell className="ps-3">
                                    <div className="font-medium">
                                        {row.provider.name ?? "—"}
                                    </div>
                                </TableCell>

                                {/* Externer Name */}
                                <TableCell>
                                    <div className="font-medium">
                                        {row.external.name_raw ?? "—"}
                                    </div>
                                </TableCell>

                                {/* Zuordnung (Combobox) */}
                                <TableCell>
                                    <ProviderProductMappingCombobox
                                        row={row}
                                        products={pharmacyProducts}
                                        isLoading={tableBusy}
                                        onSelect={(pid) =>
                                            onSetMapping(row, pid)
                                        }
                                    />
                                </TableCell>

                                {/* Status */}
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

                                {/* Usage */}
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

                                {/* Updated */}
                                <TableCell className="text-muted-foreground whitespace-nowrap">
                                    {formatDateTime(
                                        row.updated_at ?? row.created_at,
                                    )}
                                </TableCell>

                                {/* Aktionen */}
                                <TableCell className="sticky right-0 text-right pe-3">
                                    <div className="flex justify-end">
                                        <ProviderProductRowActionsMenu
                                            disabled={disableControls}
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