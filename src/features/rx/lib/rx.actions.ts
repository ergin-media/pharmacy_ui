import type { RxListItemDto } from "../types/rx.dto";
import { getRxUiStatus } from "./rx.status";

export type RxUiAction =
    | "resolve_attention"
    | "offer_create"
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