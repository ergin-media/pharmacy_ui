import type { RxListItemDto } from "../types/rx.dto";
import type { RxQueue } from "./rx.queues";

export function rxHasMissingMappings(rx: RxListItemDto) {
    return (rx.summary?.unmapped_items_count ?? 0) > 0;
}

export function rxIsCompleted(rx: RxListItemDto) {
    return rx.workflow_status === "completed";
}

export function rxIsPaid(rx: RxListItemDto) {
    return rx.payment_state === "paid" || Boolean(rx.timeline?.paid_at);
}

export function rxHasStartedPackaging(rx: RxListItemDto) {
    return Boolean(rx.timeline?.prepared_at);
}

export function rxIsReady(rx: RxListItemDto) {
    return Boolean(rx.timeline?.pickup_ready_at);
}

export function rxBelongsToQueue(rx: RxListItemDto, queue?: RxQueue): boolean {
    if (!queue || queue === "all") return true;

    switch (queue) {
        case "clarify":
            return rxHasMissingMappings(rx);

        case "await_payment":
            return (
                !rxHasMissingMappings(rx) &&
                !rxIsCompleted(rx) &&
                !rxIsPaid(rx)
            );

        case "paid_not_started":
            return (
                !rxHasMissingMappings(rx) &&
                !rxIsCompleted(rx) &&
                rxIsPaid(rx) &&
                !rxHasStartedPackaging(rx)
            );

        case "packaging":
            return (
                !rxHasMissingMappings(rx) &&
                !rxIsCompleted(rx) &&
                rxIsPaid(rx) &&
                rxHasStartedPackaging(rx) &&
                !rxIsReady(rx)
            );

        case "shipping":
            return (
                !rxHasMissingMappings(rx) &&
                !rxIsCompleted(rx) &&
                rxIsPaid(rx) &&
                rxIsReady(rx) &&
                rx.fulfillment_type === "shipping"
            );

        case "pickup":
            return (
                !rxHasMissingMappings(rx) &&
                !rxIsCompleted(rx) &&
                rxIsPaid(rx) &&
                rxIsReady(rx) &&
                rx.fulfillment_type === "pickup"
            );

        case "completed":
            return rxIsCompleted(rx);

        default:
            return true;
    }
}