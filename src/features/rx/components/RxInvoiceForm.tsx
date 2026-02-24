import { Button } from "@/components/ui/button";

export function RxInvoiceForm(props: {
    rxId: number;
    onCancel: () => void;
    onCreated: () => void | Promise<void>;
}) {
    const { rxId, onCancel, onCreated } = props;

    async function handleSubmit() {
        // TODO: später: API Call -> createInvoice(rxId)
        await onCreated();
    }

    return (
        <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
                Formular (Test) für RX #{rxId}
            </div>

            <div className="flex gap-2">
                <Button onClick={handleSubmit}>Rechnung erstellen</Button>
                <Button variant="outline" onClick={onCancel}>
                    Abbrechen
                </Button>
            </div>
        </div>
    );
}
