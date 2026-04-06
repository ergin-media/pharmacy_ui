import type { RxListItemDto } from "../types/rx.dto";
import { getRxUiStatus, type RxUiStatus } from "./rx.status";

export type RxUiAction =
    | "offer_create"
    | "mark_paid"
    | "start_processing"
    | "finish_preparation"
    | "mark_shipped"
    | "mark_picked_up"
    | "resolve_attention"
    | null;

export function getRxUiAction(rx: RxListItemDto): RxUiAction {
    const status = getRxUiStatus(rx);

    switch (status) {
        case "attention":
            return "resolve_attention";

        case "offer_create":
            return "offer_create";

        case "await_payment":
            return null;

        case "paid":
            return "start_processing";

        case "processing":
            return "finish_preparation";

        case "ready":
            return rx.fulfillment_type === "shipping"
                ? "mark_shipped"
                : rx.fulfillment_type === "pickup"
                    ? "mark_picked_up"
                    : null;

        case "completed":
            return null;

        default:
            return null;
    }
}

export function getRxUiActionLabel(action: RxUiAction): string | null {
    switch (action) {
        case "resolve_attention":
            return "Problem beheben";
        case "offer_create":
            return "Angebot erstellen";
        case "mark_paid":
            return "Zahlung bestätigen";
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