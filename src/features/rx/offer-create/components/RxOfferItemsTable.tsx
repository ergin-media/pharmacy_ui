import { Input } from "@/components/ui/input";
import type { RxOfferFormItem } from "../types/rx.offer.types";

function formatMoneyInput(cents: number) {
    return (cents / 100).toFixed(2);
}

function parseMoneyInput(value: string) {
    const normalized = value.replace(",", ".");
    const amount = Number(normalized);

    if (!Number.isFinite(amount) || amount < 0) return 0;
    return Math.round(amount * 100);
}

export function RxOfferItemsTable(props: {
    items: RxOfferFormItem[];
    onItemChange: (itemId: number, patch: Partial<RxOfferFormItem>) => void;
}) {
    const { items, onItemChange } = props;

    return (
        <div className="overflow-hidden rounded-xl border">
            <div className="grid grid-cols-[1.6fr_100px_140px_140px] gap-3 border-b bg-muted/30 px-4 py-3 text-sm font-medium">
                <div>Artikel</div>
                <div>Menge</div>
                <div>Einzelpreis</div>
                <div>Gesamt</div>
            </div>

            <div className="divide-y">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="grid grid-cols-[1.6fr_100px_140px_140px] gap-3 px-4 py-3"
                    >
                        <Input
                            value={item.label}
                            onChange={(e) =>
                                onItemChange(item.id, {
                                    label: e.target.value,
                                })
                            }
                        />

                        <Input
                            type="number"
                            min={0}
                            value={item.quantity}
                            onChange={(e) =>
                                onItemChange(item.id, {
                                    quantity: Number(e.target.value || 0),
                                })
                            }
                        />

                        <Input
                            value={formatMoneyInput(item.unitPriceCents)}
                            onChange={(e) =>
                                onItemChange(item.id, {
                                    unitPriceCents: parseMoneyInput(
                                        e.target.value,
                                    ),
                                })
                            }
                        />

                        <Input
                            value={formatMoneyInput(item.totalPriceCents)}
                            disabled
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
