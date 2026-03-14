import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";

import type { RxOfferFormValues } from "../types/rx.offer.types";
import { RxOfferItemsTable } from "./RxOfferItemsTable";
import { RxOfferSummary } from "./RxOfferSummary";
import { Info } from "lucide-react";

export function RxOfferForm(props: {
    values: RxOfferFormValues;
    onChange: <K extends keyof RxOfferFormValues>(
        key: K,
        value: RxOfferFormValues[K],
    ) => void;
    onItemChange: (
        itemId: number,
        patch: Partial<RxOfferFormValues["items"][number]>,
    ) => void;
    onAddItem: () => void;
    onRemoveItem: (itemId: number) => void;
}) {
    const { values, onChange, onItemChange, onAddItem, onRemoveItem } = props;

    return (
        <div className="grid gap-4">
            <Card className="gap-3">
                <div
                    className={`flex items-start gap-2 rounded-lg px-4 py-3 text-sm ${values.pricingMode === "provider_total"
                        ? "bg-blue-50/60 text-blue-900"
                        : "bg-emerald-50/60 text-emerald-900"
                        }`}
                >
                    <Info className="mt-0.5 size-4 opacity-70" />

                    <span>
                        {values.pricingMode === "provider_total" ? (
                            <>
                                Preisquelle: <strong>Plattformpreis</strong>
                                {values.providerName && (
                                    <>
                                        {" "}
                                        von{" "}
                                        <strong className="font-semibold">
                                            {values.providerName}
                                        </strong>
                                    </>
                                )}
                                .<br />
                                Der Gesamtpreis wurde von der Plattform übermittelt.
                            </>
                        ) : (
                            <>
                                Preisquelle: <strong>Apothekenkalkulation</strong>
                                {values.providerName && (
                                    <>
                                        {" "}
                                        für{" "}
                                        <strong className="font-semibold">
                                            {values.providerName}
                                        </strong>
                                    </>
                                )}
                                .<br />
                                Die Preise dieses Angebots müssen vollständig von der Apotheke
                                kalkuliert werden.
                            </>
                        )}
                    </span>
                </div>
            </Card>

            <Card>
                <CardContent className="grid gap-4 px-0 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="offer-number">Angebotsnummer</Label>
                        <Input
                            id="offer-number"
                            value={values.offerNumber}
                            onChange={(e) =>
                                onChange("offerNumber", e.target.value)
                            }
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Angebotsdatum</Label>
                        <DatePicker
                            value={values.issueDate}
                            onChange={(value) => onChange("issueDate", value)}
                            placeholder="Angebotsdatum wählen"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="gap-3">
                <CardHeader className="px-0">
                    <CardTitle>Patientendaten</CardTitle>
                </CardHeader>

                <CardContent className="grid gap-4 px-0">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="offer-patient-first-name">
                                Vorname
                            </Label>
                            <Input
                                id="offer-patient-first-name"
                                value={values.patientFirstName}
                                onChange={(e) =>
                                    onChange("patientFirstName", e.target.value)
                                }
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="offer-patient-last-name">
                                Nachname
                            </Label>
                            <Input
                                id="offer-patient-last-name"
                                value={values.patientLastName}
                                onChange={(e) =>
                                    onChange("patientLastName", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="offer-patient-street">Straße</Label>
                        <Input
                            id="offer-patient-street"
                            value={values.patientStreet}
                            onChange={(e) =>
                                onChange("patientStreet", e.target.value)
                            }
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-[160px_1fr]">
                        <div className="grid gap-2">
                            <Label htmlFor="offer-patient-zip">PLZ</Label>
                            <Input
                                id="offer-patient-zip"
                                value={values.patientZip}
                                onChange={(e) =>
                                    onChange("patientZip", e.target.value)
                                }
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="offer-patient-city">Ort</Label>
                            <Input
                                id="offer-patient-city"
                                value={values.patientCity}
                                onChange={(e) =>
                                    onChange("patientCity", e.target.value)
                                }
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="gap-3">
                <CardHeader className="px-0">
                    <CardTitle>Artikel</CardTitle>
                </CardHeader>

                <CardContent className="grid gap-4 px-0">
                    <RxOfferItemsTable
                        items={values.items}
                        currency={values.currency}
                        onItemChange={onItemChange}
                        onAddItem={onAddItem}
                        onRemoveItem={onRemoveItem}
                    />

                    <RxOfferSummary
                        currency={values.currency}
                        subtotalCents={values.subtotalCents}
                        shippingCents={values.shippingCents}
                        totalCents={values.totalCents}
                        onShippingChange={(value) => onChange("shippingCents", value)}
                        pricingMode={values.pricingMode} />
                </CardContent>
            </Card>

            <Card className="gap-3">
                <CardContent className="px-0">
                    <div className="grid gap-2">
                        <Label htmlFor="offer-notes">
                            Hinweise - Nur für interne Zwecke
                        </Label>
                        <Textarea
                            id="offer-notes"
                            value={values.notes}
                            placeholder="Optionale Hinweise zum Angebot"
                            onChange={(e) => onChange("notes", e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
