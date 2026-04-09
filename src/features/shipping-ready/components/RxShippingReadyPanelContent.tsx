import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { RxListItemDto } from "@/features/rx/types/rx.dto";

export function RxShippingReadyPanelContent(props: {
    rx: RxListItemDto;
    trackingId?: string | null;
    isCreatingLabel?: boolean;
    onCreateLabel?: () => void;
}) {
    const { rx, trackingId, isCreatingLabel = false, onCreateLabel } = props;

    return (
        <div className="grid gap-6">
            <div className="grid gap-2">
                <div className="text-lg font-semibold">Versand vorbereiten</div>
                <div className="text-sm text-muted-foreground">
                    Hier kann das DHL Versandlabel erzeugt werden. Nach
                    erfolgreicher Erstellung wird die Tracking-ID angezeigt.
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
                    Versandart laut Plattform:{" "}
                    {rx.fulfillment_type === "shipping"
                        ? "Versand"
                        : rx.fulfillment_type === "pickup"
                          ? "Abholung"
                          : "Unbekannt"}
                </div>
            </div>

            <div className="grid gap-4 rounded-lg border p-4">
                <div className="text-sm font-medium">DHL Versandlabel</div>

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
            </div>
        </div>
    );
}
