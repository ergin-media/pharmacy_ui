import type { RxQueue } from "../lib/rx.queues";
import { getRxQueuePrimaryAction } from "../lib/rx.queue-actions";

export function useRxPrimaryAction(input: {
    queue: RxQueue;
    takeOver: (id: number) => Promise<void>;
}) {
    const { queue, takeOver } = input;

    const handlePrimaryAction = async (id: number) => {
        const action = getRxQueuePrimaryAction(queue);

        if (!action) return;

        if (action.key === "take_over") {
            await takeOver(id);
            return;
        }

        console.warn("Unhandled primary action:", action.key);
    };

    return {
        handlePrimaryAction,
    };
}
