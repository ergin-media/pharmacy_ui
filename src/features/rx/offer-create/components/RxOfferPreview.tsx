import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/shared/lib/format/money";
import type { RxOfferFormValues } from "../types/rx.offer.types";

export function RxOfferPreview(props: { values: RxOfferFormValues }) {
    const { values } = props;

    return (
        <Card className="h-full min-h-195">
            <CardHeader>
                <CardTitle>Angebotsvorschau</CardTitle>
            </CardHeader>

            <CardContent>
                <div className="mx-auto min-h-170 w-full max-w-190 rounded-2xl border bg-white p-8 shadow-sm">
                    <div className="mb-8 flex items-start justify-between">
                        <div>
                            <h2 className="text-4xl font-semibold tracking-tight">
                                Angebot
                            </h2>
                            <p className="mt-3 text-sm text-muted-foreground">
                                PDF-Vorschau wird im nächsten Schritt über das
                                Backend generiert.
                            </p>
                        </div>

                        <div className="text-right text-sm">
                            <div className="text-muted-foreground">
                                Angebotsnummer
                            </div>
                            <div className="font-semibold">
                                {values.offerNumber}
                            </div>
                        </div>
                    </div>

                    <div className="mb-8 grid grid-cols-2 gap-8 text-sm">
                        <div className="space-y-1">
                            <div className="font-medium">Patient</div>
                            <div>
                                {[
                                    values.patientFirstName,
                                    values.patientLastName,
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                            </div>
                            <div>{values.patientStreet || "—"}</div>
                            <div>
                                {[values.patientZip, values.patientCity]
                                    .filter(Boolean)
                                    .join(" ") || "—"}
                            </div>
                            <div>{values.patientEmail || "—"}</div>
                        </div>

                        <div className="space-y-1 text-right">
                            <div>
                                <span className="text-muted-foreground">
                                    Ausgestellt:
                                </span>{" "}
                                {values.issueDate || "—"}
                            </div>
                            <div>
                                <span className="text-muted-foreground">
                                    Gültig bis:
                                </span>{" "}
                                {values.validUntil || "—"}
                            </div>
                            <div>
                                <span className="text-muted-foreground">
                                    Geburtsdatum:
                                </span>{" "}
                                {values.patientBirthdate || "—"}
                            </div>
                        </div>
                    </div>

                    <div className="mb-8 overflow-hidden rounded-xl border">
                        <div className="grid grid-cols-[1.8fr_90px_140px_140px] gap-3 border-b bg-muted/30 px-4 py-3 text-sm font-medium">
                            <div>Artikel</div>
                            <div>Menge</div>
                            <div>Preis</div>
                            <div>Gesamt</div>
                        </div>

                        <div className="divide-y">
                            {values.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="grid grid-cols-[1.8fr_90px_140px_140px] gap-3 px-4 py-3 text-sm"
                                >
                                    <div>{item.label}</div>
                                    <div>{item.quantity}</div>
                                    <div>
                                        {formatMoney(
                                            item.unitPriceCents,
                                            values.currency,
                                        )}
                                    </div>
                                    <div>
                                        {formatMoney(
                                            item.totalPriceCents,
                                            values.currency,
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="ml-auto grid max-w-[320px] gap-2 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                                Zwischensumme
                            </span>
                            <span>
                                {formatMoney(
                                    values.subtotalCents,
                                    values.currency,
                                )}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                                Versand
                            </span>
                            <span>
                                {formatMoney(
                                    values.shippingCents,
                                    values.currency,
                                )}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                                Rabatt
                            </span>
                            <span>
                                {formatMoney(
                                    values.discountCents,
                                    values.currency,
                                )}
                            </span>
                        </div>

                        <div className="flex items-center justify-between border-t pt-3 font-semibold">
                            <span>Gesamt</span>
                            <span>
                                {formatMoney(
                                    values.totalCents,
                                    values.currency,
                                )}
                            </span>
                        </div>
                    </div>

                    {values.notes ? (
                        <div className="mt-10">
                            <div className="mb-2 text-sm font-medium">
                                Hinweise
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {values.notes}
                            </div>
                        </div>
                    ) : null}
                </div>
            </CardContent>
        </Card>
    );
}
