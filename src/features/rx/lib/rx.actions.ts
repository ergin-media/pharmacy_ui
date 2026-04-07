import type { RxListItemDto } from "../types/rx.dto";

export type RxUiAction =
    | "review_attention"
    | "create_offer"
    | "start_processing"
    | "finish_preparation"
    | "mark_shipped"
    | "mark_picked_up"
    | null;

export type RxActionController = {
    run: (rx: RxListItemDto) => Promise<void> | void;
};

export type RxUiActionControllers = Partial<
    Record<Exclude<RxUiAction, null>, RxActionController>
>;

export function getRxUiAction(rx: RxListItemDto): RxUiAction {
    const status = rx.status ?? null;
    const hasAttention = rx.has_attention === true;

    if (status === "completed") {
        return null;
    }

    if (hasAttention) {
        return "review_attention";
    }

    if (status === "new") {
        return "create_offer";
    }

    if (status !== "processing") {
        return null;
    }

    const isPaid = rx.payment_state === "paid" || Boolean(rx.timeline?.paid_at);
    const isPrepared = Boolean(rx.timeline?.prepared_at);
    const isReady = Boolean(rx.timeline?.pickup_ready_at);

    if (!isPaid) {
        return null;
    }

    if (!isPrepared) {
        return "start_processing";
    }

    if (!isReady) {
        return "finish_preparation";
    }

    if (rx.fulfillment_type === "shipping") {
        return "mark_shipped";
    }

    if (rx.fulfillment_type === "pickup") {
        return "mark_picked_up";
    }

    return null;
}

export function getRxUiActionLabel(action: RxUiAction): string | null {
    switch (action) {
        case "review_attention":
            return "Prüfen";
        case "create_offer":
            return "Angebot erstellen";
        case "start_processing":
            return "In Bearbeitung starten";
        case "finish_preparation":
            return "Fertig vorbereiten";
        case "mark_shipped":
            return "Als versendet markieren";
        case "mark_picked_up":
            return "Als abgeholt markieren";
        default:
            return null;
    }
}
