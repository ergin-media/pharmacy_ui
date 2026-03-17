import type { RxListItemDto } from "../types/rx.dto";
import type { RxQueue } from "./rx.queues";

export function rxHasMissingMappings(rx: RxListItemDto) {
    return (rx.summary?.unmapped_items_count ?? 0) > 0;
}

export function rxIsCompleted(rx: RxListItemDto) {
    return rx.workflow_status === "completed";
}

export function rxBelongsToQueue(rx: RxListItemDto, queue?: RxQueue): boolean {
    if (!queue || queue === "all") return true;

    switch (queue) {
        case "clarify":
            return rxHasMissingMappings(rx);

        case "completed":
            return rxIsCompleted(rx);

        /**
         * Für alle "aktiven" Bearbeitungsqueues:
         * Sobald ein RX kein Klärfall mehr ist und nicht abgeschlossen ist,
         * darf es in der jeweiligen Listenlogik weiter bestehen bzw. vom Backend
         * korrekt einsortiert werden.
         *
         * Für den konkreten Fix "aus Klärfälle raus" reicht das bereits.
         * Die exakte Queue-Zuordnung kommt danach per invalidate vom Backend.
         */
        case "inbox":
        case "offer_create":
        case "await_payment":
        case "paid_not_started":
        case "packaging":
        case "shipping":
        case "pickup":
            return !rxHasMissingMappings(rx) && !rxIsCompleted(rx);

        default:
            return true;
    }
}
