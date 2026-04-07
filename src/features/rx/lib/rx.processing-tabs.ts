import type { RxListItemDto } from "../types/rx.dto";

export const RX_PROCESSING_TABS = {
    all: {
        label: "Alle",
    },
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
    "all",
    "awaiting_payment",
    "paid",
    "shipping_ready",
    "pickup_ready",
];

export const RX_PROCESSING_TAB_ITEMS = RX_PROCESSING_TAB_ORDER.map((value) => ({
    value,
    ...RX_PROCESSING_TABS[value],
}));

export type RxProcessingTabCounts = Partial<
    Record<Exclude<RxProcessingTab, "all">, number>
>;

export function isRxPaid(rx: RxListItemDto) {
    return rx.payment_state === "paid" || Boolean(rx.timeline?.paid_at);
}

export function isRxReady(rx: RxListItemDto) {
    return Boolean(rx.timeline?.pickup_ready_at);
}

export function matchesProcessingTab(
    rx: RxListItemDto,
    tab?: RxProcessingTab,
): boolean {
    if (rx.status !== "processing" || rx.has_attention === true) {
        return false;
    }

    if (!tab || tab === "all") {
        return true;
    }

    const isPaidValue = isRxPaid(rx);
    const isReadyValue = isRxReady(rx);

    switch (tab) {
        case "awaiting_payment":
            return !isPaidValue;

        case "paid":
            return isPaidValue && !isReadyValue;

        case "shipping_ready":
            return isReadyValue && rx.fulfillment_type === "shipping";

        case "pickup_ready":
            return isReadyValue && rx.fulfillment_type === "pickup";

        default:
            return true;
    }
}

export function getProcessingTabCounts(
    items: RxListItemDto[],
): RxProcessingTabCounts {
    const processingItems = items.filter(
        (rx) => rx.status === "processing" && rx.has_attention !== true,
    );

    return {
        awaiting_payment: processingItems.filter((rx) =>
            matchesProcessingTab(rx, "awaiting_payment"),
        ).length,
        paid: processingItems.filter((rx) => matchesProcessingTab(rx, "paid"))
            .length,
        shipping_ready: processingItems.filter((rx) =>
            matchesProcessingTab(rx, "shipping_ready"),
        ).length,
        pickup_ready: processingItems.filter((rx) =>
            matchesProcessingTab(rx, "pickup_ready"),
        ).length,
    };
}