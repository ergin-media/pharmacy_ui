import type { RxListItemDto } from "../types/rx.dto";
import type { RxQueue } from "./rx.queues";

export function rxHasMissingMappings(rx: RxListItemDto) {
    return (rx.summary?.unmapped_items_count ?? 0) > 0;
}

export function rxIsCompleted(rx: RxListItemDto) {
    return (
        rx.workflow_status === "completed" ||
        Boolean(rx.timeline?.completed_at) ||
        Boolean(rx.timeline?.fulfilled_at)
    );
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

/**
 * Queue-Zuordnung für die UI.
 *
 * Wichtige Annahmen für den aktuellen Workflow:
 * - prepared_at => "In Vorbereitung" wurde gestartet
 * - pickup_ready_at => "Fertig vorbereitet"
 * - danach landet der Fall je nach fulfillment_type in Versand oder Abholung
 * - completed_at / fulfilled_at => abgeschlossen
 */
export function rxBelongsToQueue(
    rx: RxListItemDto,
    queue?: RxQueue,
): boolean {
    if (!queue || queue === "all") return true;

    const hasMissingMappings = rxHasMissingMappings(rx);
    const isCompleted = rxIsCompleted(rx);
    const isPaid = rxIsPaid(rx);
    const hasStartedPackaging = rxHasStartedPackaging(rx);
    const isReady = rxIsReady(rx);
    const fulfillmentType = rx.fulfillment_type;

    switch (queue) {
        case "clarify":
            return hasMissingMappings;

        case "inbox":
            return (
                !hasMissingMappings &&
                !isCompleted &&
                !rx.timeline?.offer_created_at
            );

        case "offer_create":
            return (
                !hasMissingMappings &&
                !isCompleted &&
                !rx.timeline?.offer_created_at
            );

        case "await_payment":
            return (
                !hasMissingMappings &&
                !isCompleted &&
                Boolean(rx.timeline?.offer_created_at) &&
                Boolean(rx.timeline?.offer_sent_at) &&
                !isPaid
            );

        case "paid_not_started":
            return (
                !hasMissingMappings &&
                !isCompleted &&
                isPaid &&
                !hasStartedPackaging
            );

        case "packaging":
            return (
                !hasMissingMappings &&
                !isCompleted &&
                isPaid &&
                hasStartedPackaging &&
                !isReady
            );

        case "shipping":
            return (
                !hasMissingMappings &&
                !isCompleted &&
                isPaid &&
                isReady &&
                fulfillmentType === "shipping"
            );

        case "pickup":
            return (
                !hasMissingMappings &&
                !isCompleted &&
                isPaid &&
                isReady &&
                fulfillmentType === "pickup"
            );

        case "completed":
            return isCompleted;

        default:
            return true;
    }
}