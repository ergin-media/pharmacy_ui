import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RxOfferFormValues } from "../types/rx.offer.types";
import { useRxOfferPreview } from "../hooks/useRxOfferPreview";

export function RxOfferPreview(props: { values: RxOfferFormValues }) {
    const { values } = props;

    const preview = useRxOfferPreview(values);

    return (
        <Card className="h-full min-h-195">
            <CardHeader>
                <CardTitle>Angebotsvorschau</CardTitle>
            </CardHeader>

            <CardContent>
                <div className="flex min-h-170 w-full items-center justify-center overflow-hidden rounded-2xl border bg-white shadow-sm">
                    {!preview.isValid ? (
                        <div className="px-6 text-center text-sm text-muted-foreground">
                            Bitte vervollständige die Angebotsdaten, damit die
                            PDF-Vorschau erzeugt werden kann.
                        </div>
                    ) : preview.error ? (
                        <div className="px-6 text-center text-sm text-destructive">
                            {preview.error}
                        </div>
                    ) : preview.blobUrl ? (
                        <div className="relative h-170 w-full">
                            {preview.isLoading ? (
                                <div className="absolute inset-x-0 top-0 z-10 border-b bg-background/90 px-3 py-2 text-xs text-muted-foreground backdrop-blur">
                                    Vorschau wird aktualisiert…
                                </div>
                            ) : null}

                            <iframe
                                title={`Angebotsvorschau ${values.offerNumber}`}
                                src={preview.blobUrl}
                                className="h-full w-full"
                            />
                        </div>
                    ) : (
                        <div className="px-6 text-center text-sm text-muted-foreground">
                            Vorschau wird geladen…
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}