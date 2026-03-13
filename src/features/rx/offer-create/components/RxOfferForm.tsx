import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { RxOfferFormValues } from "../types/rx.offer.types";
import { RxOfferItemsTable } from "./RxOfferItemsTable";
import { RxOfferSummary } from "./RxOfferSummary";

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
                <CardHeader>
                    <CardTitle>Patientendaten</CardTitle>
                </CardHeader>

                <CardContent className="grid gap-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Input
                            value={values.patientName}
                            placeholder="Name"
                            onChange={(e) =>
                                onChange("patientName", e.target.value)
                            }
                        />
                        <Input
                            value={values.patientBirthdate}
                            type="date"
                            onChange={(e) =>
                                onChange("patientBirthdate", e.target.value)
                            }
                        />
                    </div>

                    <Input
                        value={values.patientStreet}
                        placeholder="Straße"
                        onChange={(e) =>
                            onChange("patientStreet", e.target.value)
                        }
                    />

                    <div className="grid gap-4 md:grid-cols-[160px_1fr]">
                        <Input
                            value={values.patientZip}
                            placeholder="PLZ"
                            onChange={(e) =>
                                onChange("patientZip", e.target.value)
                            }
                        />
                        <Input
                            value={values.patientCity}
                            placeholder="Ort"
                            onChange={(e) =>
                                onChange("patientCity", e.target.value)
                            }
                        />
                    </div>

                    <Input
                        value={values.patientEmail}
                        placeholder="E-Mail"
                        onChange={(e) =>
                            onChange("patientEmail", e.target.value)
                        }
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Angebotsdetails</CardTitle>
                </CardHeader>

                <CardContent className="grid gap-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Input
                            value={values.offerNumber}
                            placeholder="Angebotsnummer"
                            onChange={(e) =>
                                onChange("offerNumber", e.target.value)
                            }
                        />
                        <Input
                            value={values.currency}
                            placeholder="Währung"
                            onChange={(e) =>
                                onChange("currency", e.target.value)
                            }
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Input
                            value={values.issueDate}
                            type="date"
                            onChange={(e) =>
                                onChange("issueDate", e.target.value)
                            }
                        />
                        <Input
                            value={values.validUntil}
                            type="date"
                            onChange={(e) =>
                                onChange("validUntil", e.target.value)
                            }
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Artikel</CardTitle>
                </CardHeader>

                <CardContent className="grid gap-4">
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
                <CardHeader>
                    <CardTitle>Hinweise</CardTitle>
                </CardHeader>

                <CardContent>
                    <Textarea
                        value={values.notes}
                        placeholder="Optionale Hinweise zum Angebot"
                        onChange={(e) => onChange("notes", e.target.value)}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
