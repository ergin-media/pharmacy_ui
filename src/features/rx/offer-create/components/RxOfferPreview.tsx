import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { RxOfferFormValues } from "../types/rx.offer.types";
import { useRxOfferPreview } from "../hooks/useRxOfferPreview";

export function RxOfferPreview(props: { values: RxOfferFormValues }) {
    const { values } = props;

    const preview = useRxOfferPreview(values);

    return (
        <Card className="flex h-full min-h-195 flex-col">
            <CardContent className="flex min-h-0 flex-1 flex-col p-0">
                <div className="relative flex min-h-0 flex-1 flex-col">
                    {!preview.isValid ? (
                        <div className="flex h-full flex-1 items-center justify-center px-6 text-center text-sm text-muted-foreground">
                            Bitte vervollständige die Angebotsdaten, damit die
                            PDF-Vorschau erzeugt werden kann.
                        </div>
                    ) : preview.error ? (
                        <div className="flex h-full flex-1 items-center justify-center px-6 text-center text-sm text-destructive">
                            {preview.error}
                        </div>
                    ) : preview.blobUrl ? (
                        <>
                            <iframe
                                title={`Angebotsvorschau ${values.offerNumber}`}
                                src={preview.blobUrl}
                                className="absolute inset-0 h-full w-full"
                            />

                            {preview.isLoading && (
                                <div className="absolute inset-0 z-10 grid place-items-center bg-background/70 backdrop-blur-sm">
                                    <Loader2 className="size-8 animate-spin text-muted-foreground" />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex h-full flex-1 items-center justify-center px-6 text-center text-sm text-muted-foreground">
                            Vorschau wird geladen…
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}