import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { RxOfferFormValues } from "../types/rx.offer.types";
import { useRxOfferPreview } from "../hooks/useRxOfferPreview";

export function RxOfferPreview(props: { values: RxOfferFormValues }) {
    const { values } = props;

    const preview = useRxOfferPreview(values);

    return (
        <Card className="h-full min-h-195">
            <CardContent>
                <div className="relative flex min-h-170 w-full items-center justify-center overflow-hidden rounded-2xl border bg-white shadow-sm">
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
                        <>
                            {/* PDF */}
                            <iframe
                                title={`Angebotsvorschau ${values.offerNumber}`}
                                src={preview.blobUrl}
                                className="h-170 w-full"
                            />

                            {/* Loading Overlay */}
                            {preview.isLoading && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                                    <Loader2 className="size-8 animate-spin text-muted-foreground" />
                                </div>
                            )}
                        </>
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