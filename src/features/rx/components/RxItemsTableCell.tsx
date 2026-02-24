import { Badge } from "@/components/ui/badge";
import { TableCell } from "@/components/ui/table";
import { formatQuantity } from "@/shared/lib/format/quantity";
import { AlertTriangle } from "lucide-react";
import type { RxItem } from "../types/rx.dto";

type PriceMeta = {
    isComplete: boolean;
    hint: string | null;
};

function rxItemHasMapping(it: RxItem) {
    const v = it.mapping?.has_pharmacy_product;
    if (typeof v === "boolean") return v;
    if (typeof v === "number") return v === 1;
    return Boolean(it.mapping?.pharmacy_product_id);
}

function rxItemLabel(it: RxItem) {
    // bevorzugt: raw name, fallback norm, fallback sku
    return it.raw_product_name ?? it.normalized_product_name ?? it.sku ?? "—";
}

export function RxItemsTableCell(props: {
    rxItems: RxItem[];
    unmappedCount: number;
    priceMeta: PriceMeta;
}) {
    const { rxItems, unmappedCount, priceMeta } = props;

    return (
        <TableCell>
            {rxItems.length > 0 ? (
                <div className="min-w-80 space-y-1">
                    {rxItems.map((it) => {
                        const mapped = rxItemHasMapping(it);

                        return (
                            <div
                                key={String(it.id)}
                                className="flex items-center gap-1.5"
                            >
                                {/* Name */}
                                <div className="min-w-0 truncate">
                                    <span className="mr-1 text-muted-foreground">
                                        •
                                    </span>
                                    {rxItemLabel(it)}
                                </div>

                                {/* Menge + ggf. Mapping-Icon (direkt daneben) */}
                                <div className="flex items-center gap-2 whitespace-nowrap text-xs text-muted-foreground">
                                    <span>
                                        (
                                        {formatQuantity(
                                            it.quantity ?? null,
                                            it.unit ?? null,
                                        )}
                                        )
                                    </span>

                                    {!mapped ? (
                                        <AlertTriangle className="size-4 text-destructive" />
                                    ) : null}
                                </div>
                            </div>
                        );
                    })}

                    {/* Preis-Hinweis */}
                    {!priceMeta.isComplete && priceMeta.hint ? (
                        <Badge variant="danger">{priceMeta.hint}</Badge>
                    ) : null}
                </div>
            ) : (
                <div className="text-sm text-muted-foreground">—</div>
            )}
        </TableCell>
    );
}