import type { RxListItemDto } from "../types/rx.dto";
import { getRxUiStatus, type RxUiStatus } from "./rx.ui-status";

export type RxUiAction =
    | "review_attention"
    | "create_offer"
    | "start_processing"
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
            return "review_attention";

        case "new":
            return "create_offer";

        case "awaiting_payment":
            return null;

        case "paid":
            return "start_processing";

        case "shipping_ready":
            return "mark_shipped";

        case "pickup_ready":
            return "mark_picked_up";

        case "completed":
            return null;

        default:
            return null;
    }
}

export function getRxUiActionLabel(action: RxUiAction): string | null {
    switch (action) {
        case "review_attention":
            return "Prüfen";
        case "create_offer":
            return "Angebot erstellen";
        case "start_processing":
            return "In Bearbeitung starten";
        case "mark_shipped":
            return "Als versendet markieren";
        case "mark_picked_up":
            return "Als abgeholt markieren";
        default:
            return null;
    }
}

export function getRxUiActionFromStatus(status: RxUiStatus): RxUiAction {
    switch (status) {
        case "attention":
            return "review_attention";
        case "new":
            return "create_offer";
        case "awaiting_payment":
            return null;
        case "paid":
            return "start_processing";
        case "shipping_ready":
            return "mark_shipped";
        case "pickup_ready":
            return "mark_picked_up";
        case "completed":
            return null;
        default:
            return null;
    }
}
