import type { RxQueue } from "../lib/rx.queues";
import { getRxQueuePrimaryAction } from "../lib/rx.queue-actions";

export type RxPrimaryActionHandlers = {
    takeOver: (id: number) => Promise<void>;
    openOfferCreate: (id: number) => void;

    confirmPayment?: (id: number) => Promise<void>;
    startPackaging?: (id: number) => Promise<void>;
    finishPackaging?: (id: number) => Promise<void>;
    markShipped?: (id: number) => Promise<void>;
    markPickedUp?: (id: number) => Promise<void>;
};

export function useRxPrimaryAction(input: {
    queue: RxQueue;
    actions: RxPrimaryActionHandlers;
}) {
    const { queue, actions } = input;

    const handlePrimaryAction = async (id: number) => {
        const action = getRxQueuePrimaryAction(queue);

        if (!action) return;

        switch (action.key) {
            case "take_over":
                await actions.takeOver(id);
                return;

            case "create_offer":
                actions.openOfferCreate(id);
                return;

            case "confirm_payment":
                await actions.confirmPayment?.(id);
                return;

            case "start_packaging":
                await actions.startPackaging?.(id);
                return;

            case "finish_packaging":
                await actions.finishPackaging?.(id);
                return;

            case "mark_shipped":
                await actions.markShipped?.(id);
                return;

            case "mark_picked_up":
                await actions.markPickedUp?.(id);
                return;

            default:
                console.warn("Unhandled primary action:", action.key);
        }
    };

    return {
        handlePrimaryAction,
    };
}
