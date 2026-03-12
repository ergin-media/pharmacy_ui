import { Button } from "@/components/ui/button";

export function RxOfferCreatePanel(props: {
    rxId: number;
    onCancel: () => void;
    onCreated: () => Promise<void> | void;
}) {
    const { rxId, onCancel, onCreated } = props;

    return (
        <div className="grid gap-4">
            <div className="text-sm text-muted-foreground">
                Angebotserstellung für RX #{rxId}
            </div>

            <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                Hier kann später die eigentliche Angebotslogik eingebaut werden
                (Positionen prüfen, Preise berechnen, Angebot speichern/senden).
            </div>

            <div className="flex items-center justify-end gap-2">
                <Button variant="outline" onClick={onCancel}>
                    Abbrechen
                </Button>

                <Button onClick={() => onCreated()}>
                    Angebot testweise abschließen
                </Button>
            </div>
        </div>
    );
}
