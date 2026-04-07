import type { RxListItemDto } from "../types/rx.dto";

export const RX_PROCESSING_TABS = {
    awaiting_payment: {
        label: "Warten auf Zahlung",
    },
    paid: {
        label: "Bezahlt",
    },
    shipping_ready: {
        label: "Versandbereit",
    },
    pickup_ready: {
        label: "Abholbereit",
    },
} as const;

export type RxProcessingTab = keyof typeof RX_PROCESSING_TABS;

export const RX_PROCESSING_TAB_ORDER: RxProcessingTab[] = [
    "awaiting_payment",
    "paid",
    "shipping_ready",
    "pickup_ready",
];

export const RX_PROCESSING_TAB_ITEMS = RX_PROCESSING_TAB_ORDER.map((value) => ({
    value,
    ...RX_PROCESSING_TABS[value],
}));

export type RxProcessingTabCounts = Record<RxProcessingTab, number>;

export function isRxPaid(rx: RxListItemDto) {
    return rx.payment_state === "paid" || Boolean(rx.timeline?.paid_at);
}

export function isRxReady(rx: RxListItemDto) {
    return Boolean(rx.timeline?.pickup_ready_at);
}

export function getRxProcessingTab(
    rx: RxListItemDto,
): RxProcessingTab | null {
    if (rx.status !== "processing" || rx.has_attention === true) {
        return null;
    }

    const paid = isRxPaid(rx);
    const ready = isRxReady(rx);

    if (!paid) {
        return "awaiting_payment";
    }

    if (!ready) {
        return "paid";
    }

    if (rx.fulfillment_type === "shipping") {
        return "shipping_ready";
    }

    if (rx.fulfillment_type === "pickup") {
        return "pickup_ready";
    }

    return null;
}

export function matchesProcessingTab(
    rx: RxListItemDto,
    tab?: RxProcessingTab,
): boolean {
    if (!tab) return false;
    return getRxProcessingTab(rx) === tab;
}

export function getProcessingTabCounts(
    items: RxListItemDto[],
): RxProcessingTabCounts {
    return {
        awaiting_payment: items.filter(
            (rx) => getRxProcessingTab(rx) === "awaiting_payment",
        ).length,
        paid: items.filter((rx) => getRxProcessingTab(rx) === "paid").length,
        shipping_ready: items.filter(
            (rx) => getRxProcessingTab(rx) === "shipping_ready",
        ).length,
        pickup_ready: items.filter(
            (rx) => getRxProcessingTab(rx) === "pickup_ready",
        ).length,
    };
}