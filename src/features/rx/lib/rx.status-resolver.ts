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
    // 1. Wichtig: Attention überschreibt alles
    if (rx.has_attention) {
        return "attention";
    }

    // 2. Completed
    if (rx.status === "completed") {
        return "completed";
    }

    // 3. New
    if (rx.status === "new") {
        return "new";
    }

    // 4. Processing → Detailstatus bestimmen
    if (rx.status === "processing") {
        const isPaid =
            rx.payment_state === "paid" ||
            Boolean(rx.timeline?.paid_at);

        const isReady = Boolean(rx.timeline?.pickup_ready_at);

        if (!isPaid) {
            return "awaiting_payment";
        }

        if (!isReady) {
            return "paid";
        }

        if (rx.fulfillment_type === "shipping") {
            return "shipping_ready";
        }

        if (rx.fulfillment_type === "pickup") {
            return "pickup_ready";
        }
    }

    return "new";
}