import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { RxListItemDto } from "@/features/rx/types/rx.dto";

export function RxShippingReadyPanelContent(props: {
    rx: RxListItemDto;
    trackingId?: string | null;
    isCreatingLabel?: boolean;
    onCreateLabel?: () => void;
    onCancel?: () => void;
}) {
    const {
        rx,
        trackingId,
        isCreatingLabel = false,
        onCreateLabel,
        onCancel,
    } = props;

    return (
        <div className="grid gap-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                        Versand vorbereiten
                    </CardTitle>
                    <CardContent>
                        Hier kann das DHL Versandlabel erzeugt werden. Nach
                        erfolgreicher Erstellung wird die Tracking-ID angezeigt.
                    </CardContent>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Rezept</CardTitle>
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
                        {rx.fulfillment_type === "shipping"
                            ? "Versand"
                            : rx.fulfillment_type === "pickup"
                              ? "Abholung"
                              : "Unbekannt"}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>DHL Versandlabel</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label>Tracking-ID</Label>
                        <Input value={trackingId ?? ""} readOnly />
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            onClick={onCreateLabel}
                            disabled={isCreatingLabel}
                        >
                            {isCreatingLabel
                                ? "Versandlabel wird erstellt..."
                                : "Versandlabel erzeugen"}
                        </Button>

                        {trackingId ? (
                            <Badge variant="success">Label erstellt</Badge>
                        ) : null}
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Schließen
                </Button>
            </div>
        </div>
    );
}
