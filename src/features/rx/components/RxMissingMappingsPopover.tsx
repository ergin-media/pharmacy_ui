import { useMemo, useState } from "react";

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
    onSubmit: (input: {
        rxDocumentId: number;
        mappings: Array<{
            rxItemId: number;
            providerProductMapId: number;
            pharmacyProductId: number | null;
        }>;
    }) => Promise<void>;
}) {
    const { rx, unmappedItems, pharmacyProducts, isLoading, onSubmit } = props;

    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [draftMappings, setDraftMappings] = useState<
        Record<number, number | null>
    >(() =>
        Object.fromEntries(
            unmappedItems.map((item) => [Number(item.id), null]),
        ),
    );

    const allAssigned = useMemo(
        () =>
            unmappedItems.every(
                (item) => draftMappings[Number(item.id)] != null,
            ),
        [draftMappings, unmappedItems],
    );

    async function handleSubmit() {
        if (!allAssigned || isSubmitting) return;

        setIsSubmitting(true);

        try {
            await onSubmit({
                rxDocumentId: Number(rx.id),
                mappings: unmappedItems.map((item) => ({
                    rxItemId: Number(item.id),
                    providerProductMapId: Number(item.provider_product_map_id),
                    pharmacyProductId: draftMappings[Number(item.id)] ?? null,
                })),
            });

            setOpen(false);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (unmappedItems.length === 0) return null;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
                <Button type="button" variant="outline" size="sm">
                    <Settings2 className="mr-2 size-4" />
                    Zuordnen
                </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-140 p-4">
                <div className="grid gap-3">
                    <div className="text-sm font-medium">
                        Fehlende Zuordnungen verwalten
                    </div>

                    <div className="grid gap-3">
                        {unmappedItems.map((item, index) => (
                            <div
                                key={item.id}
                                className="grid gap-2 rounded-lg border p-3"
                            >
                                <div className="text-xs text-muted-foreground">
                                    Artikel {index + 1}
                                </div>

                                <div className="text-sm">
                                    {rxItemLabel(item)}
                                </div>

                                <ProviderProductMappingCombobox
                                    currentPharmacyProductId={
                                        draftMappings[Number(item.id)] ?? null
                                    }
                                    isUnmapped
                                    products={pharmacyProducts}
                                    isLoading={isLoading || isSubmitting}
                                    onSelect={(pharmacyProductId) =>
                                        setDraftMappings((prev) => ({
                                            ...prev,
                                            [Number(item.id)]: pharmacyProductId,
                                        }))
                                    }
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isSubmitting}
                        >
                            Abbrechen
                        </Button>

                        <Button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!allAssigned || isSubmitting}
                        >
                            Zuordnungen übernehmen
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}