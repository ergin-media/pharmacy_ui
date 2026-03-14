import { Label } from "@/components/ui/label";
import { MoneyInput } from "@/components/ui/money-input";
import { formatMoney } from "@/shared/lib/format/money";

import type { RxOfferFormValues } from "../types/rx.offer.types";

export function RxOfferSummary(props: {
    currency: string;
    pricingMode: RxOfferFormValues["pricingMode"];
    subtotalCents: number;
    shippingCents: number;
    totalCents: number;
    onShippingChange: (value: number) => void;
}) {
    const {
        currency,
        subtotalCents,
        shippingCents,
        totalCents,
        onShippingChange,
    } = props;

    return (
        <div className="grid gap-4 rounded-xl border p-4">
            <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Zwischensumme</span>
                <span className="font-medium">
                    {formatMoney(subtotalCents, currency)}
                </span>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="offer-shipping">Versand</Label>

                <MoneyInput
                    cents={shippingCents}
                    currency={currency}
                    onChange={onShippingChange}
                />
            </div>

            <div className="flex items-center justify-between border-t pt-3 text-sm">
                <span className="font-medium">Gesamt</span>
                <span className="text-base font-semibold">
                    {formatMoney(totalCents, currency)}
                </span>
            </div>
        </div>
    );
}