import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { NumberInput } from "@/components/ui/number-input";
import type { RxOfferFormItem } from "../types/rx.offer.types";
import { Plus, Trash2 } from "lucide-react";
import { MoneyInput } from "@/components/ui/money-input";
import { RxOfferProductCombobox } from "./RxOfferProductCombobox";
import { mapOfferItemPharmacyProductToDto } from "../lib/rx-offer.mappers";

export function RxOfferItemsTable(props: {
    items: RxOfferFormItem[];
    currency?: string;
    onItemChange: (itemId: number, patch: Partial<RxOfferFormItem>) => void;
    onAddItem: () => void;
    onRemoveItem: (itemId: number) => void;
}) {
    const {
        items,
        currency = "EUR",
        onItemChange,
        onAddItem,
        onRemoveItem,
    } = props;

    return (
        <div className="overflow-hidden rounded-xl border">
            <div className="divide-y">
                {items.map((item, index) => {
                    const selectedProduct =
                        mapOfferItemPharmacyProductToDto(item);

                    return (
                        <div key={item.id} className="space-y-4 px-4 py-4">
                            <div className="flex items-end gap-3">
                                <div className="grid flex-1 gap-2">
                                    <Label
                                        htmlFor={`offer-item-label-${item.id}`}
                                    >
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
                                        onSelectProduct={(product) => {
                                            const unitPriceCents =
                                                product.prices
                                                    .base_price_cents ?? 0;

                                            onItemChange(item.id, {
                                                pharmacyProductId: product.id,
                                                label: product.name,
                                                unitPriceCents,
                                                totalPriceCents:
                                                    item.quantity *
                                                    unitPriceCents,
                                            });
                                        }}
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

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor={`offer-item-qty-${item.id}`}
                                    >
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
                                        htmlFor={`offer-item-unit-price-${item.id}`}
                                    >
                                        Preis
                                    </Label>

                                    <MoneyInput
                                        cents={item.unitPriceCents}
                                        currency={currency}
                                        onChange={(value) =>
                                            onItemChange(item.id, {
                                                unitPriceCents: value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor={`offer-item-total-${item.id}`}
                                    >
                                        Gesamt
                                    </Label>

                                    <MoneyInput
                                        cents={item.totalPriceCents}
                                        currency={currency}
                                        disabled
                                        onChange={() => {}}
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
