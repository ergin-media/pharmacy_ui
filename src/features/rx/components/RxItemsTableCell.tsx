import { Badge } from "@/components/ui/badge";
import { TableCell } from "@/components/ui/table";
import { formatQuantity } from "@/shared/lib/format/quantity";
import { AlertTriangle } from "lucide-react";

import type { RxItem, RxListItemDto } from "../types/rx.dto";
import {
    rxItemHasMapping,
    rxShouldShowPriceUpdateHint,
} from "../lib/rx.reparse";

type PriceMeta = {
    isComplete: boolean;
    hint: string | null;
};

function rxItemLabel(it: RxItem) {
    return it.raw_product_name ?? it.normalized_product_name ?? it.sku ?? "—";
}

export function RxItemsTableCell(props: {
    rx: RxListItemDto;
    rxItems: RxItem[];
    unmappedCount: number;
    priceMeta: PriceMeta;
}) {
    const { rx, rxItems, unmappedCount, priceMeta } = props;

    const showPriceWarning = rxShouldShowPriceUpdateHint(rx, unmappedCount);

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

                                {/* Menge + ggf. Warn-Icon direkt daneben */}
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

                    {/* Mapping-Hinweis */}
                    {
                        /*
                        unmappedCount > 0 ? (
                            <Badge variant="danger">
                                {unmappedCount === 1
                                    ? "1 Artikel ohne Zuordnung"
                                    : `${unmappedCount} Artikel ohne Zuordnung`}
                            </Badge>
                        ) : null
                         */
                    }

                    {/* Preis-Hinweis (✅ inkl. pricing_base_price_missing aus parse.flags/warnings) */}
                    {showPriceWarning ? (
                        <Badge variant="danger">
                            {priceMeta.hint ?? "Preis muss aktualisiert werden"}
                        </Badge>
                    ) : null}
                </div>
            ) : (
                <div className="text-sm text-muted-foreground">—</div>
            )}
        </TableCell>
    );
}