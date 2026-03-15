import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

import { ProviderProductMappingCombobox } from "@/features/provider-products/components/ProviderProductMappingCombobox";

import type { PharmacyProductDto } from "@/features/pharmacy-products/types/pharmacy-products.dto";
import type { RxItem, RxListItemDto } from "../types/rx.dto";
import { formatQuantity } from "@/shared/lib/format/quantity";
import { Settings2 } from "lucide-react";

function rxItemLabel(it: RxItem) {
    return it.raw_product_name ?? it.normalized_product_name ?? it.sku ?? "—";
}

export function RxMissingMappingsPopover(props: {
    rx: RxListItemDto;
    unmappedItems: RxItem[];
    pharmacyProducts: PharmacyProductDto[];
    isLoading?: boolean;
    onAssign: (input: {
        rxItemId: number;
        providerProductMapId: number;
        pharmacyProductId: number | null;
    }) => Promise<void>;
}) {
    const { rx, unmappedItems, pharmacyProducts, isLoading, onAssign } = props;

    if (unmappedItems.length === 0) return null;

    return (
        <Popover>
            <PopoverTrigger>
                <Button type="button" variant="outline" size="sm">
                    <Settings2 className="mr-2 size-4" />
                    Zuordnen
                </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-[560px] p-4">
                <div className="grid gap-4">
                    <div>
                        <div className="text-sm font-medium">
                            Fehlende Zuordnungen
                        </div>
                        <div className="text-sm text-muted-foreground">
                            RX #{rx.id} · {unmappedItems.length}{" "}
                            {unmappedItems.length === 1
                                ? "Artikel ohne Zuordnung"
                                : "Artikel ohne Zuordnung"}
                        </div>
                    </div>

                    <Separator />

                    <div className="grid gap-4">
                        {unmappedItems.map((item, index) => {
                            const providerProductMapId = Number(
                                item.provider_product_map_id ?? 0,
                            );

                            return (
                                <div
                                    key={item.id}
                                    className="grid gap-2 rounded-lg border p-3"
                                >
                                    <div className="text-sm font-medium">
                                        Artikel {index + 1}
                                    </div>

                                    <div className="text-sm">
                                        {rxItemLabel(item)}
                                    </div>

                                    <div className="text-xs text-muted-foreground">
                                        Menge:{" "}
                                        {formatQuantity(
                                            item.quantity ?? null,
                                            item.unit ?? null,
                                        )}
                                    </div>

                                    <ProviderProductMappingCombobox
                                        currentPharmacyProductId={null}
                                        isUnmapped
                                        products={pharmacyProducts}
                                        isLoading={isLoading}
                                        onSelect={(pharmacyProductId) =>
                                            onAssign({
                                                rxItemId: Number(item.id),
                                                providerProductMapId,
                                                pharmacyProductId,
                                            })
                                        }
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}