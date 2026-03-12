import type { RxQueue } from "./rx.queues";

export type RxQueuePrimaryActionKey =
    | "take_over"
    | "create_offer"
    | "confirm_payment"
    | "start_packaging"
    | "finish_packaging"
    | "mark_shipped"
    | "mark_picked_up";

export type RxQueuePrimaryActionConfig = {
    key: RxQueuePrimaryActionKey;
    label: string;
};

export type RxPrimaryActionHandlers = {
    takeOver: (id: number) => Promise<void>;
    openOfferCreate: (id: number) => void;

    confirmPayment?: (id: number) => Promise<void>;
    startPackaging?: (id: number) => Promise<void>;
    finishPackaging?: (id: number) => Promise<void>;
    markShipped?: (id: number) => Promise<void>;
    markPickedUp?: (id: number) => Promise<void>;
};

export const RX_QUEUE_PRIMARY_ACTIONS: Partial<
    Record<RxQueue, RxQueuePrimaryActionConfig>
> = {
    inbox: {
        key: "take_over",
        label: "Übernehmen",
    },
    offer_create: {
        key: "create_offer",
        label: "Angebot erstellen",
    },
    await_payment: {
        key: "confirm_payment",
        label: "Zahlung bestätigen",
    },
    paid_not_started: {
        key: "start_packaging",
        label: "In Vorbereitung",
    },
    packaging: {
        key: "finish_packaging",
        label: "Fertig vorbereitet",
    },
    shipping: {
        key: "mark_shipped",
        label: "Als versendet markieren",
    },
    pickup: {
        key: "mark_picked_up",
        label: "Als abgeholt markieren",
    },
};

export function getRxQueuePrimaryAction(queue: RxQueue) {
    return RX_QUEUE_PRIMARY_ACTIONS[queue] ?? null;
}
