import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoneyInput } from "@/components/ui/money-input";

import type { PharmacyProductFormValues } from "../types/pharmacy-product-form.types";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";

export function PharmacyProductForm(props: {
    values: PharmacyProductFormValues;
    onChange: <K extends keyof PharmacyProductFormValues>(
        key: K,
        value: PharmacyProductFormValues[K],
    ) => void;
}) {
    const { values, onChange } = props;

    return (
        <Card className="gap-3">

            <CardContent className="grid gap-4 px-0">

                <div className="grid gap-2">
                    <Label>Name</Label>
                    <Input
                        value={values.name}
                        onChange={(e) => onChange("name", e.target.value)}
                    />
                </div>

                <div className="grid gap-2">
                    <Label>PZN</Label>
                    <Input
                        value={values.product_code}
                        onChange={(e) =>
                            onChange("product_code", e.target.value)
                        }
                    />
                </div>

                <div className="grid gap-2">
                    <Label>Hersteller</Label>
                    <Input
                        value={values.manufacturer}
                        onChange={(e) =>
                            onChange("manufacturer", e.target.value)
                        }
                    />
                </div>

                <div className="grid gap-2">
                    <Label>Strain</Label>
                    <Input
                        value={values.strain}
                        onChange={(e) => onChange("strain", e.target.value)}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Label>Basispreis</Label>
                        <MoneyInput
                            cents={values.base_price_cents}
                            currency={values.currency}
                            onChange={(v) => onChange("base_price_cents", v)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Preis (andere)</Label>
                        <MoneyInput
                            cents={values.price_other_provider_cents ?? 0}
                            currency={values.currency}
                            onChange={(v) =>
                                onChange("price_other_provider_cents", v)
                            }
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Switch
                        checked={values.is_active}
                        onCheckedChange={(v) => onChange("is_active", v)}
                    />
                    <span className="text-sm">Aktiv</span>
                </div>
            </CardContent>
        </Card>
    );
}