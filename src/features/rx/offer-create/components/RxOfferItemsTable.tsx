import { Input } from "@/components/ui/input";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";

import type { RxOfferFormItem } from "../types/rx.offer.types";
import { MoneyInput } from "./RxMoneyInput";

export function RxOfferItemsTable(props: {
    items: RxOfferFormItem[];
    currency?: string;
    onItemChange: (itemId: number, patch: Partial<RxOfferFormItem>) => void;
}) {
    const { items, currency = "EUR", onItemChange } = props;

    return (
        <div className="overflow-hidden rounded-xl border">
            <div className="divide-y">
                {items.map((item, index) => (
                    <div
                        key={item.id}
                        className="grid grid-cols-[minmax(0,1.8fr)_110px_180px_180px] gap-3 px-4 py-4"
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

                            <InputGroup>
                                <InputGroupInput
                                    id={`offer-item-qty-${item.id}`}
                                    type="number"
                                    min={0}
                                    step="1"
                                    value={item.quantity}
                                    className="text-right"
                                    onChange={(e) =>
                                        onItemChange(item.id, {
                                            quantity: Number(
                                                e.target.value || 0,
                                            ),
                                        })
                                    }
                                />
                                <InputGroupAddon align="inline-end">
                                    <InputGroupText>{item.unit}</InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
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
                    </div>
                ))}
            </div>
        </div>
    );
}
