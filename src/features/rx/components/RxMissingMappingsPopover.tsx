import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { LoadingButton } from "@/components/ui/loading-button";

import { PharmacyProductSearchCombobox } from "@/features/pharmacy-products/components/PharmacyProductSearchCombobox";

import type { RxItem, RxListItemDto } from "../types/rx.dto";
import { Settings2 } from "lucide-react";

function rxItemLabel(it: RxItem) {
    return it.raw_product_name ?? it.normalized_product_name ?? it.sku ?? "—";
}

function MappingRow(props: {
    item: RxItem;
    selectedPharmacyProductId: number | null;
    isDisabled?: boolean;
    onSelect: (pharmacyProductId: number | null) => void;
}) {
    const { item, selectedPharmacyProductId, isDisabled, onSelect } = props;

    const [searchValue, setSearchValue] = useState("");

    const inputValue = useMemo(() => {
        return searchValue;
    }, [searchValue]);

    return (
        <div className="grid gap-2 rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Artikel</div>

            <div className="text-sm">{rxItemLabel(item)}</div>

            <PharmacyProductSearchCombobox
                inputValue={inputValue}
                selectedProductId={selectedPharmacyProductId}
                selectedProduct={null}
                disabled={isDisabled}
                isUnmapped
                placeholder="Zuordnung wählen…"
                onInputValueChange={setSearchValue}
                onSelectProduct={(product) => {
                    setSearchValue("");
                    onSelect(product.id);
                }}
                onClearSelection={() => {
                    setSearchValue("");
                    onSelect(null);
                }}
            />
        </div>
    );
}

export function RxMissingMappingsPopover(props: {
    rx: RxListItemDto;
    unmappedItems: RxItem[];
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
    const { rx, unmappedItems, isLoading, onSubmit } = props;

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
                    Artikel zuordnen
                </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-140 p-4">
                <div className="grid gap-3">
                    <div className="text-sm font-medium">
                        Fehlende Zuordnungen verwalten
                    </div>

                    <div className="grid gap-3">
                        {unmappedItems.map((item) => (
                            <MappingRow
                                key={item.id}
                                item={item}
                                selectedPharmacyProductId={
                                    draftMappings[Number(item.id)] ?? null
                                }
                                isDisabled={Boolean(isLoading) || isSubmitting}
                                onSelect={(pharmacyProductId) =>
                                    setDraftMappings((prev) => ({
                                        ...prev,
                                        [Number(item.id)]: pharmacyProductId,
                                    }))
                                }
                            />
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

                        <LoadingButton
                            type="button"
                            onClick={handleSubmit}
                            disabled={!allAssigned || isSubmitting}
                            loading={isSubmitting}
                        >
                            Zuordnungen übernehmen
                        </LoadingButton>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
