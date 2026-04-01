import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";

import { Plus, Trash2 } from "lucide-react";

import type { RxManualCreateItem } from "../types/rx-manual-create.types";
import { RxOfferProductCombobox } from "@/features/rx/offer-create/components/RxOfferProductCombobox";
import { mapOfferItemPharmacyProductToDto } from "@/features/rx/offer-create/lib/rx-offer.mappers";

export function RxManualCreateItemsTable(props: {
    items: RxManualCreateItem[];
    onItemChange: (itemId: number, patch: Partial<RxManualCreateItem>) => void;
    onAddItem: () => void;
    onRemoveItem: (itemId: number) => void;
}) {
    const { items, onItemChange, onAddItem, onRemoveItem } = props;

    return (
        <div className="overflow-hidden rounded-xl border">
            <div className="divide-y">
                {items.map((item, index) => {
                    const selectedProduct = mapOfferItemPharmacyProductToDto({
                        pharmacyProductId: item.pharmacyProductId,
                        label: item.label,
                        quantity: item.quantity,
                        unit: item.unit,
                        unitPriceCents: 0,
                        totalPriceCents: 0,
                    });

                    return (
                        <div key={item.id} className="space-y-4 px-4 py-4">
                            <div className="flex items-end gap-3">
                                <div className="grid flex-1 gap-2">
                                    <Label htmlFor={`manual-rx-item-${item.id}`}>
                                        Artikel {index + 1}
                                    </Label>

                                    <RxOfferProductCombobox
                                        value={item.label}
                                        selectedProductId={
                                            item.pharmacyProductId ?? null
                                        }
                                        selectedProduct={selectedProduct}
                                        onInputChange={(value) =>
                                            onItemChange(item.id, {
                                                label: value,
                                                pharmacyProductId: null,
                                            })
                                        }
                                        onSelectProduct={(product) =>
                                            onItemChange(item.id, {
                                                pharmacyProductId: product.id,
                                                label: product.name,
                                            })
                                        }
                                    />
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    disabled={items.length <= 1}
                                    onClick={() => onRemoveItem(item.id)}
                                    aria-label={`Artikel ${index + 1} entfernen`}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>

                            <div className="grid gap-4 md:grid-cols-[1fr_140px_120px]">
                                <div className="grid gap-2">
                                    <Label htmlFor={`manual-rx-label-${item.id}`}>
                                        Freitext / Bezeichnung
                                    </Label>
                                    <Input
                                        id={`manual-rx-label-${item.id}`}
                                        value={item.label}
                                        onChange={(e) =>
                                            onItemChange(item.id, {
                                                label: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor={`manual-rx-qty-${item.id}`}>
                                        Menge
                                    </Label>

                                    <NumberInput
                                        value={item.quantity}
                                        unit={item.unit}
                                        onChange={(value) =>
                                            onItemChange(item.id, {
                                                quantity: value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor={`manual-rx-unit-${item.id}`}>
                                        Einheit
                                    </Label>
                                    <Input
                                        id={`manual-rx-unit-${item.id}`}
                                        value={item.unit}
                                        onChange={(e) =>
                                            onItemChange(item.id, {
                                                unit: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="border-t bg-muted/20 px-4 py-3">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onAddItem}
                >
                    <Plus className="mr-2 size-4" />
                    Artikel hinzufügen
                </Button>
            </div>
        </div>
    );
}