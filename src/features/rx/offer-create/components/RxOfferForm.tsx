import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { RxOfferFormValues } from "../types/rx.offer.types";
import { RxOfferItemsTable } from "./RxOfferItemsTable";
import { RxOfferSummary } from "./RxOfferSummary";
import { Label } from "@/components/ui/label";

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
}) {
    const { values, onChange, onItemChange } = props;

    return (
        <div className="grid gap-4">
            <Card>
                <CardHeader className="px-0">
                    <CardTitle>Patientendaten</CardTitle>
                </CardHeader>

                <CardContent className="grid gap-4 px-0">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="offer-patient-name">
                                Name des Patienten
                            </Label>
                            <Input
                                id="offer-patient-name"
                                value={values.patientName}
                                onChange={(e) =>
                                    onChange("patientName", e.target.value)
                                }
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="offer-patient-birthdate">
                                Geburtsdatum
                            </Label>
                            <Input
                                id="offer-patient-birthdate"
                                value={values.patientBirthdate}
                                type="date"
                                onChange={(e) =>
                                    onChange("patientBirthdate", e.target.value)
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

                    <div className="grid gap-2">
                        <Label htmlFor="offer-patient-email">E-Mail</Label>
                        <Input
                            id="offer-patient-email"
                            value={values.patientEmail}
                            onChange={(e) =>
                                onChange("patientEmail", e.target.value)
                            }
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="px-0">
                    <CardTitle>Angebotsdetails</CardTitle>
                </CardHeader>

                <CardContent className="grid gap-4 px-0">
                    <div className="grid gap-4 md:grid-cols-2">
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
                            <Label htmlFor="offer-currency">Währung</Label>
                            <Input
                                id="offer-currency"
                                value={values.currency}
                                onChange={(e) =>
                                    onChange("currency", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="offer-issue-date">
                                Ausstellungsdatum
                            </Label>
                            <Input
                                id="offer-issue-date"
                                value={values.issueDate}
                                type="date"
                                onChange={(e) =>
                                    onChange("issueDate", e.target.value)
                                }
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="offer-valid-until">
                                Gültig bis
                            </Label>
                            <Input
                                id="offer-valid-until"
                                value={values.validUntil}
                                type="date"
                                onChange={(e) =>
                                    onChange("validUntil", e.target.value)
                                }
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="px-0">
                    <CardTitle>Artikel</CardTitle>
                </CardHeader>

                <CardContent className="grid gap-4 px-0">
                    <RxOfferItemsTable
                        items={values.items}
                        onItemChange={onItemChange}
                    />

                    <RxOfferSummary
                        currency={values.currency}
                        subtotalCents={values.subtotalCents}
                        shippingCents={values.shippingCents}
                        discountCents={values.discountCents}
                        totalCents={values.totalCents}
                        onShippingChange={(value) =>
                            onChange("shippingCents", value)
                        }
                        onDiscountChange={(value) =>
                            onChange("discountCents", value)
                        }
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="px-0">
                    <CardTitle>Hinweise</CardTitle>
                </CardHeader>

                <CardContent className="px-0">
                    <div className="grid gap-2">
                        <Label htmlFor="offer-notes">Interne Hinweise</Label>
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
