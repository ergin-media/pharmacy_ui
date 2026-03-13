import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { NumberInput } from "@/components/ui/number-input";
import type { RxOfferFormItem } from "../types/rx.offer.types";
import { Plus, Trash2 } from "lucide-react";
import { MoneyInput } from "@/components/ui/money-input";

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
                {items.map((item, index) => (
                    <div
                        key={item.id}
                        className="grid grid-cols-[minmax(0,1.8fr)_120px_180px_180px_48px] gap-3 px-4 py-4"
                    >
                        <div className="grid min-w-0 gap-2">
                            <Label htmlFor={`offer-item-label-${item.id}`}>
                                Artikel {index + 1}
                            </Label>

                            <Input
                                id={`offer-item-label-${item.id}`}
                                value={item.label}
                                onChange={(e) =>
                                    onItemChange(item.id, {
                                        label: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor={`offer-item-qty-${item.id}`}>
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
                            <Label htmlFor={`offer-item-unit-price-${item.id}`}>
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
                            <Label htmlFor={`offer-item-total-${item.id}`}>
                                Gesamt
                            </Label>

                            <MoneyInput
                                cents={item.totalPriceCents}
                                currency={currency}
                                disabled
                                onChange={() => {}}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label className="opacity-0">Aktion</Label>

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
                    </div>
                ))}
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
