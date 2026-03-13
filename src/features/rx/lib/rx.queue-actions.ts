import type { RxListItemDto } from "../types/rx.dto";
import type { RxQueue } from "./rx.queues";

export type RxQueuePrimaryActionConfig = {
    label: string;
};

export type RxActionController = {
    run: (rx: RxListItemDto) => Promise<void> | void;
};

export type RxPrimaryActionControllers = Partial<
    Record<RxQueue, RxActionController>
>;

export const RX_QUEUE_PRIMARY_ACTIONS: Partial<
    Record<RxQueue, RxQueuePrimaryActionConfig>
> = {
    inbox: {
        label: "Übernehmen",
    },
    offer_create: {
        label: "Angebot erstellen",
    },
    await_payment: {
        label: "Zahlung bestätigen",
    },
    paid_not_started: {
        label: "In Vorbereitung",
    },
    packaging: {
        label: "Fertig vorbereitet",
    },
    shipping: {
        label: "Als versendet markieren",
    },
    pickup: {
        label: "Als abgeholt markieren",
    },
};

export function getRxQueuePrimaryAction(queue: RxQueue) {
    return RX_QUEUE_PRIMARY_ACTIONS[queue] ?? null;
}
