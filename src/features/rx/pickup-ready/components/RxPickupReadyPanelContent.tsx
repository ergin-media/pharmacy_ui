import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { RxListItemDto } from "@/features/rx/types/rx.dto";

export function RxPickupReadyPanelContent(props: {
    rx: RxListItemDto;
    pickupMailSentAt?: string | null;
    isSending?: boolean;
    onSendPickupMail?: () => void;
    onResendPickupMail?: () => void;
}) {
    const {
        rx,
        pickupMailSentAt,
        isSending = false,
        onSendPickupMail,
        onResendPickupMail,
    } = props;

    const hasSent = Boolean(pickupMailSentAt);

    return (
        <div className="grid gap-6">
            <div className="grid gap-2">
                <div className="text-lg font-semibold">
                    Abholung vorbereiten
                </div>
                <div className="text-sm text-muted-foreground">
                    Hier kann die Benachrichtigung an den Patienten versendet
                    werden, dass das Rezept zur Abholung bereitliegt.
                </div>
            </div>

            <div className="grid gap-4 rounded-lg border p-4">
                <div className="text-sm font-medium">Rezept</div>
                <div className="text-sm text-muted-foreground">ID: {rx.id}</div>
                <div className="text-sm text-muted-foreground">
                    Patient: {rx.patient?.first_name} {rx.patient?.last_name}
                </div>
                <div className="text-sm text-muted-foreground">
                    Bestell-ID: {rx.external_order_id ?? "—"}
                </div>
                <div className="text-sm text-muted-foreground">
                    Wunsch laut Plattform:{" "}
                    {rx.fulfillment_type === "pickup"
                        ? "Abholung"
                        : rx.fulfillment_type === "shipping"
                          ? "Versand"
                          : "Unbekannt"}
                </div>
            </div>

            <div className="grid gap-4 rounded-lg border p-4">
                <div className="flex items-center gap-3">
                    <div className="text-sm font-medium">
                        Abholbenachrichtigung
                    </div>

                    {hasSent ? (
                        <Badge variant="success">Bereits versendet</Badge>
                    ) : (
                        <Badge variant="outline">Noch nicht versendet</Badge>
                    )}
                </div>

                <div className="text-sm text-muted-foreground">
                    {hasSent
                        ? `Die Abholnachricht wurde am ${pickupMailSentAt} versendet.`
                        : "Es wurde bisher noch keine Abholnachricht versendet."}
                </div>

                <div className="flex items-center gap-3">
                    {!hasSent ? (
                        <Button
                            type="button"
                            onClick={onSendPickupMail}
                            disabled={isSending}
                        >
                            {isSending
                                ? "Benachrichtigung wird gesendet..."
                                : "Abholnachricht senden"}
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onResendPickupMail}
                            disabled={isSending}
                        >
                            {isSending
                                ? "Benachrichtigung wird gesendet..."
                                : "Erneut senden"}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
