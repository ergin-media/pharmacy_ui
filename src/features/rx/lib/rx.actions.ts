import type { RxListItemDto } from "../types/rx.dto";
import { getRxUiStatus } from "./rx.ui-status";

export type RxUiAction =
    | "review_attention"
    | "create_offer"
    | "mark_shipping_ready"
    | "mark_pickup_ready"
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
            if (rx.fulfillment_type === "shipping") {
                return "mark_shipping_ready";
            }

            if (rx.fulfillment_type === "pickup") {
                return "mark_pickup_ready";
            }

            return null;

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
        case "mark_shipping_ready":
            return "Versandbereit";
        case "mark_pickup_ready":
            return "Abholbereit";
        case "mark_shipped":
            return "Als versendet markieren";
        case "mark_picked_up":
            return "Als abgeholt markieren";
        default:
            return null;
    }
}
