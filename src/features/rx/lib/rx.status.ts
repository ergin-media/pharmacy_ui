import type { RxListItemDto } from "../types/rx.dto";

export type RxUiStatus =
    | "attention"
    | "offer_create"
    | "await_payment"
    | "paid"
    | "processing"
    | "ready"
    | "completed";

export function getRxUiStatus(rx: RxListItemDto): RxUiStatus {
    const isCompleted =
        rx.workflow_status === "completed" ||
        Boolean(rx.timeline?.completed_at);

    if (isCompleted) {
        return "completed";
    }

    const hasAttention =
        (rx.summary?.unmapped_items_count ?? 0) > 0 ||
        rx.summary?.price_is_complete === false ||
        rx.parse?.flags?.pricing_base_price_missing === true;

    if (hasAttention) {
        return "attention";
    }

    const hasOffer = Boolean(rx.timeline?.offer_created_at);
    const isPaid =
        rx.payment_state === "paid" || Boolean(rx.timeline?.paid_at);
    const hasStartedProcessing = Boolean(rx.timeline?.prepared_at);
    const isReady = Boolean(rx.timeline?.pickup_ready_at);

    if (!hasOffer) {
        return "offer_create";
    }

    if (!isPaid) {
        return "await_payment";
    }

    if (!hasStartedProcessing) {
        return "paid";
    }

    if (!isReady) {
        return "processing";
    }

    return "ready";
}

export function getRxUiStatusLabel(status: RxUiStatus): string {
    switch (status) {
        case "attention":
            return "Handlungsbedarf";
        case "offer_create":
            return "Angebot erstellen";
        case "await_payment":
            return "Warten auf Zahlung";
        case "paid":
            return "Bezahlt";
        case "processing":
            return "In Bearbeitung";
        case "ready":
            return "Bereit";
        case "completed":
            return "Abgeschlossen";
        default:
            return "—";
    }
}