import type { RxListItemDto } from "../types/rx.dto";

export type RxUiStatus =
    | "new"
    | "awaiting_payment"
    | "paid"
    | "shipping_ready"
    | "pickup_ready"
    | "completed"
    | "attention";

export function getRxUiStatus(rx: RxListItemDto): RxUiStatus {
    if (rx.has_attention === true) {
        return "attention";
    }

    if (rx.status === "completed") {
        return "completed";
    }

    if (rx.status === "new") {
        return "new";
    }

    if (rx.status === "processing") {
        const isPaid =
            rx.payment_state === "paid" || Boolean(rx.timeline?.paid_at);

        const isReady = Boolean(rx.timeline?.pickup_ready_at);

        if (!isPaid) {
            return "awaiting_payment";
        }

        if (rx.fulfillment_type === "shipping" && isReady) {
            return "shipping_ready";
        }

        if (rx.fulfillment_type === "pickup" && isReady) {
            return "pickup_ready";
        }

        return "paid";
    }

    return "new";
}
