import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export function RxInvoicePanel(props: {
    rxId: number;
    onCancel: () => void;
    onCreated: () => void | Promise<void>;
}) {
    const { rxId, onCancel, onCreated } = props;

    return (
        <div className="space-y-4">
            <div>
                <div className="text-sm text-muted-foreground">
                    Rechnung erstellen für RX #{rxId}
                </div>
            </div>

            <Card className="p-4 space-y-3">
                <div className="text-sm font-medium">Rechnungsdaten</div>

                <Input placeholder="Rechnungsnummer (optional)" />
                <Input placeholder="Hinweis / Kommentar (optional)" />
            </Card>

            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onCancel}>
                    Abbrechen
                </Button>
                <Button
                    onClick={async () => {
                        // TODO: API call "create invoice"
                        await onCreated();
                    }}
                >
                    Rechnung erstellen
                </Button>
            </div>
        </div>
    );
}
