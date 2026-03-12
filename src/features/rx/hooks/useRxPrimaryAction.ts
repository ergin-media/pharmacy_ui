import type { RxQueue } from "../lib/rx.queues";
import type {
    RxActionController,
    RxPrimaryActionControllers,
} from "../lib/rx.queue-actions";

function getPrimaryActionController(
    queue: RxQueue,
    controllers: RxPrimaryActionControllers,
): RxActionController | null {
    return controllers[queue] ?? null;
}

export function useRxPrimaryAction(input: {
    queue: RxQueue;
    controllers: RxPrimaryActionControllers;
}) {
    const { queue, controllers } = input;

    const controller = getPrimaryActionController(queue, controllers);

    const handlePrimaryAction = async (id: number) => {
        if (!controller) return;
        await controller.run(id);
    };

    const isPrimaryActionBusy = (id: number) => {
        return controller?.isBusy(id) ?? false;
    };

    return {
        handlePrimaryAction,
        isPrimaryActionBusy,
    };
}
