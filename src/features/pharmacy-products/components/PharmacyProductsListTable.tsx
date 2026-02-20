import { formatDateTime } from "@/shared/lib/format/date";
import type {
    PharmacyProductDto,
    PharmacyProductsSort,
} from "../types/pharmacy-products.dto";

import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { PharmacyProductsListTableSkeleton } from "./PharmacyProductsListTableSkeleton";
import { PharmacyProductRowActionsMenu } from "./PharmacyProductRowActionsMenu";
import { formatMoney } from "@/shared/lib/format/money";

function sortIcon(current: PharmacyProductsSort, col: PharmacyProductsSort) {
    if (current !== col) return <ArrowUpDown className="size-4 opacity-50" />;
    if (col.endsWith("_asc")) return <ArrowUp className="size-4" />;
    return <ArrowDown className="size-4" />;
}

export function PharmacyProductsListTable(props: {
    items: PharmacyProductDto[];
    isLoading?: boolean;
    perPage: number;

    sort: PharmacyProductsSort;
    onSortChange: (next: PharmacyProductsSort) => void;

    onCopyPzn?: (p: PharmacyProductDto) => void;
    onOpenDetails?: (p: PharmacyProductDto) => void;
    onEdit?: (p: PharmacyProductDto) => void;
    onToggleActive?: (p: PharmacyProductDto) => void;
}) {
    const {
        items,
        isLoading,
        perPage,
        sort,
        onSortChange,
        onCopyPzn,
        onOpenDetails,
        onEdit,
        onToggleActive,
    } = props;

    const sortMap: Record<
        "name" | "price",
        { asc: PharmacyProductsSort; desc: PharmacyProductsSort }
    > = {
        name: { asc: "name_asc", desc: "name_desc" },
        price: { asc: "price_asc", desc: "price_desc" },
    };

    function toggleSort(key: keyof typeof sortMap) {
        const pair = sortMap[key];
        const next = sort === pair.desc ? pair.asc : pair.desc;
        onSortChange(next);
    }

    return (
        <div className="overflow-x-auto rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="ps-3">
                            <button
                                type="button"
                                className="inline-flex items-center gap-2 hover:underline"
                                onClick={() => toggleSort("name")}
                            >
                                Name
                                {sortIcon(sort, "name_asc")}
                            </button>
                        </TableHead>

                        <TableHead className="w-40">PZN</TableHead>

                        <TableHead className="w-28">Status</TableHead>

                        <TableHead
                            className="w-44 text-right"
                            onClick={() => toggleSort("price")}
                        >
                            <div className="flex justify-between items-center">
                                <span>Basispreis</span>
                                {sortIcon(sort, "price_asc")}
                            </div>
                        </TableHead>

                        <TableHead className="w-44 text-right">
                            Preis (andere)
                        </TableHead>

                        <TableHead className="w-52">Aktualisiert</TableHead>

                        <TableHead className="w-28 text-right pe-3">
                            Aktionen
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        <PharmacyProductsListTableSkeleton rows={perPage} />
                    ) : items.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={7}
                                className="text-muted-foreground"
                            >
                                Keine Produkte gefunden.
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((p) => (
                            <TableRow key={p.id} className="hover:bg-muted/50">
                                <TableCell className="ps-3">
                                    <div className="font-medium">{p.name}</div>
                                    {p.manufacturer ? (
                                        <div className="text-xs text-muted-foreground">
                                            {p.manufacturer}
                                        </div>
                                    ) : null}
                                </TableCell>

                                <TableCell className="text-muted-foreground">
                                    {p.product_code}
                                </TableCell>

                                <TableCell>
                                    <Badge
                                        variant={
                                            p.is_active
                                                ? "success"
                                                : "secondary"
                                        }
                                    >
                                        {p.is_active ? "Aktiv" : "Inaktiv"}
                                    </Badge>
                                </TableCell>

                                <TableCell>
                                    {formatMoney(p.prices.base_price_cents)}
                                </TableCell>

                                <TableCell className="text-right">
                                    {formatMoney(
                                        p.prices.price_other_provider_cents,
                                    )}
                                </TableCell>

                                <TableCell className="whitespace-nowrap text-muted-foreground">
                                    {formatDateTime(
                                        p.updated_at ?? p.created_at,
                                    )}
                                </TableCell>

                                <TableCell className="sticky right-0 text-right pe-3">
                                    <div className="flex justify-end">
                                        <PharmacyProductRowActionsMenu
                                            disabled={isLoading}
                                            toggleLabel={
                                                p.is_active
                                                    ? "Deaktivieren"
                                                    : "Aktivieren"
                                            }
                                            onOpenDetails={() =>
                                                onOpenDetails?.(p)
                                            }
                                            onCopyPzn={() => onCopyPzn?.(p)}
                                            onEdit={() => onEdit?.(p)}
                                            onToggleActive={() =>
                                                onToggleActive?.(p)
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
