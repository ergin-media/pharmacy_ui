import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RxListItemDto } from "@/features/rx/types/rx.dto";

export function RxPickupReadyPanelContent(props: {
    rx: RxListItemDto;
    pickupMailSentAt?: string | null;
    isSending?: boolean;
    onSendPickupMail?: () => void;
    onResendPickupMail?: () => void;
    onCancel?: () => void;
}) {
    const {
        rx,
        pickupMailSentAt,
        isSending = false,
        onSendPickupMail,
        onResendPickupMail,
        onCancel,
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

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Rezept</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2 text-sm text-muted-foreground">
                    <div>ID: {rx.id}</div>
                    <div>
                        Patient: {rx.patient?.first_name}{" "}
                        {rx.patient?.last_name}
                    </div>
                    <div>Bestell-ID: {rx.external_order_id ?? "—"}</div>
                    <div>
                        Wunsch laut Plattform:{" "}
                        {rx.fulfillment_type === "pickup"
                            ? "Abholung"
                            : rx.fulfillment_type === "shipping"
                              ? "Versand"
                              : "Unbekannt"}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">
                        Abholbenachrichtigung
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="flex items-center gap-3">
                        {hasSent ? (
                            <Badge variant="success">Bereits versendet</Badge>
                        ) : (
                            <Badge variant="outline">
                                Noch nicht versendet
                            </Badge>
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
                </CardContent>
            </Card>

            <div className="flex items-center justify-end gap-3 border-t pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Schließen
                </Button>
            </div>
        </div>
    );
}
