import { Badge } from "@/components/ui/badge";
import { TableCell } from "@/components/ui/table";
import { formatQuantity } from "@/shared/lib/format/quantity";
import { AlertTriangle } from "lucide-react";

import type { RxItem, RxListItemDto } from "../types/rx.dto";
import { getPriceMeta } from "../lib/rx.summary";
import {
    rxItemHasMapping,
    rxShouldShowPriceUpdateHint,
} from "../lib/rx.reparse";
import { RxMissingMappingsPopover } from "./RxMissingMappingsPopover";
import { useRxMissingMappings } from "../hooks/useRxMissingMappings";

function rxItemLabel(it: RxItem) {
    return it.raw_product_name ?? it.normalized_product_name ?? it.sku ?? "—";
}

export function RxItemsTableCell(props: {
    rx: RxListItemDto;
    rxItems: RxItem[];
    unmappedCount: number;
    priceMeta: ReturnType<typeof getPriceMeta>;
}) {
    const { rx, rxItems, unmappedCount, priceMeta } = props;

    const showPriceWarning = rxShouldShowPriceUpdateHint(rx, unmappedCount);

    const missingMappingsVm = useRxMissingMappings(rx);

    return (
        <TableCell>
            {rxItems.length > 0 ? (
                <div className="min-w-80 space-y-2">
                    {rxItems.map((it) => {
                        const mapped = rxItemHasMapping(it);

                        return (
                            <div
                                key={String(it.id)}
                                className="flex items-center gap-1.5"
                            >
                                <div className="min-w-0 truncate">
                                    <span className="mr-1 text-muted-foreground">
                                        •
                                    </span>
                                    {rxItemLabel(it)}
                                </div>

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

                    {unmappedCount > 0 ? (
                        <div className="pt-1">
                            <RxMissingMappingsPopover
                                rx={rx}
                                unmappedItems={missingMappingsVm.unmappedItems}
                                pharmacyProducts={
                                    missingMappingsVm.pharmacyProducts
                                }
                                isLoading={missingMappingsVm.isLoadingProducts}
                                onAssign={
                                    missingMappingsVm.actions.assignMapping
                                }
                            />
                        </div>
                    ) : null}

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