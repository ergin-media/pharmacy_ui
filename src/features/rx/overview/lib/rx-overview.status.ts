import type { BadgeVariant } from "@/components/ui/badge.variants";
import type { RxListItemDto } from "../../types/rx.dto";

export type RxOverviewStatus =
    | "attention"
    | "new"
    | "offer_required"
    | "awaiting_payment"
    | "paid"
    | "in_progress"
    | "ready"
    | "completed";

function hasAttention(rx: RxListItemDto) {
    const unmappedCount = rx.summary?.unmapped_items_count ?? 0;

    return (
        unmappedCount > 0 ||
        rx.summary?.price_is_complete === false ||
        rx.parse?.flags?.pricing_base_price_missing === true
    );
}

export function getRxOverviewStatus(rx: RxListItemDto): RxOverviewStatus {
    if (rx.workflow_status === "completed" || rx.timeline?.completed_at) {
        return "completed";
    }

    if (hasAttention(rx)) {
        return "attention";
    }

    if (!rx.timeline?.offer_created_at) {
        return "offer_required";
    }

    if (!rx.timeline?.paid_at && rx.payment_state !== "paid") {
        return "awaiting_payment";
    }

    if (!rx.timeline?.prepared_at) {
        return "paid";
    }

    if (!rx.timeline?.pickup_ready_at) {
        return "in_progress";
    }

    return "ready";
}

export function getRxOverviewStatusLabel(status: RxOverviewStatus): string {
    switch (status) {
        case "attention":
            return "Handlungsbedarf";
        case "new":
            return "Neu";
        case "offer_required":
            return "Angebot erstellen";
        case "awaiting_payment":
            return "Warten auf Zahlung";
        case "paid":
            return "Bezahlt";
        case "in_progress":
            return "In Bearbeitung";
        case "ready":
            return "Bereit";
        case "completed":
            return "Abgeschlossen";
        default:
            return "—";
    }
}

export function getRxOverviewStatusVariant(
    status: RxOverviewStatus,
): BadgeVariant {
    switch (status) {
        case "attention":
            return "destructive";
        case "new":
            return "secondary";
        case "offer_required":
            return "warning";
        case "awaiting_payment":
            return "secondary";
        case "paid":
            return "success";
        case "in_progress":
            return "info";
        case "ready":
            return "success";
        case "completed":
            return "success";
        default:
            return "secondary";
    }
}