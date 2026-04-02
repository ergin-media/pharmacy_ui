import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import { Input } from "@/components/ui/input";

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
                        id: item.id,
                        pharmacyProductId: item.pharmacyProductId,
                        label: "",
                        quantity: item.quantity,
                        unit: item.unit,
                        unitPriceCents: 0,
                        totalPriceCents: 0,
                    });

                    return (
                        <div key={item.id} className="space-y-4 px-4 py-4">
                            <div className="flex items-end gap-3">
                                <div className="grid flex-1 gap-2">
                                    <Label
                                        htmlFor={`manual-rx-item-${item.id}`}
                                    >
                                        Artikel {index + 1}
                                    </Label>

                                    <RxOfferProductCombobox
                                        value={selectedProduct?.name ?? ""}
                                        selectedProductId={
                                            item.pharmacyProductId ?? null
                                        }
                                        selectedProduct={selectedProduct}
                                        onInputChange={() => {}}
                                        onSelectProduct={(product) =>
                                            onItemChange(item.id, {
                                                pharmacyProductId: product.id,
                                            })
                                        }
                                        onClearSelection={() =>
                                            onItemChange(item.id, {
                                                pharmacyProductId: null,
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

                            <div className="grid gap-4 md:grid-cols-[160px_120px]">
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
                                    <Label
                                        htmlFor={`manual-rx-unit-${item.id}`}
                                    >
                                        Einheit
                                    </Label>
                                    <Input
                                        id={`manual-rx-unit-${item.id}`}
                                        value={String(item.unit)}
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
