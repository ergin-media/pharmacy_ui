import { Input } from "@/components/ui/input";
import { formatMoney } from "@/shared/lib/format/money";

export function RxOfferSummary(props: {
    currency: string;
    subtotalCents: number;
    shippingCents: number;
    discountCents: number;
    totalCents: number;
    onShippingChange: (value: number) => void;
    onDiscountChange: (value: number) => void;
}) {
    const {
        currency,
        subtotalCents,
        shippingCents,
        discountCents,
        totalCents,
        onShippingChange,
        onDiscountChange,
    } = props;

    function parseMoneyInput(value: string) {
        const normalized = value.replace(",", ".");
        const amount = Number(normalized);

        if (!Number.isFinite(amount) || amount < 0) return 0;
        return Math.round(amount * 100);
    }

    return (
        <div className="grid gap-3 rounded-xl border p-4">
            <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Zwischensumme</span>
                <span className="font-medium">
                    {formatMoney(subtotalCents, currency)}
                </span>
            </div>

            <div className="grid grid-cols-[120px_1fr] items-center gap-3">
                <span className="text-sm text-muted-foreground">Versand</span>
                <Input
                    value={(shippingCents / 100).toFixed(2)}
                    onChange={(e) =>
                        onShippingChange(parseMoneyInput(e.target.value))
                    }
                />
            </div>

            <div className="grid grid-cols-[120px_1fr] items-center gap-3">
                <span className="text-sm text-muted-foreground">Rabatt</span>
                <Input
                    value={(discountCents / 100).toFixed(2)}
                    onChange={(e) =>
                        onDiscountChange(parseMoneyInput(e.target.value))
                    }
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
