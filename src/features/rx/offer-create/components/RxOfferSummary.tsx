import { Label } from "@/components/ui/label";
import {
    InputGroup,
    InputGroupInput,
    InputGroupAddon,
    InputGroupText,
} from "@/components/ui/input-group";
import { formatMoney } from "@/shared/lib/format/money";

function formatMoneyInput(cents: number) {
    return (cents / 100).toFixed(2);
}

function parseMoneyInput(value: string) {
    const normalized = value.replace(",", ".");
    const amount = Number(normalized);

    if (!Number.isFinite(amount) || amount < 0) return 0;

    return Math.round(amount * 100);
}

export function RxOfferSummary(props: {
    currency: string;
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

                <InputGroup>
                    <InputGroupInput
                        id="offer-shipping"
                        value={formatMoneyInput(shippingCents)}
                        className="text-right"
                        onChange={(e) =>
                            onShippingChange(parseMoneyInput(e.target.value))
                        }
                    />
                    <InputGroupAddon align="inline-end">
                        <InputGroupText>{currency}</InputGroupText>
                    </InputGroupAddon>
                </InputGroup>
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
