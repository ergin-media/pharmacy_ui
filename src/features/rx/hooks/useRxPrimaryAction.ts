import type { RxListItemDto } from "../types/rx.dto";
import {
    getRxUiAction,
    type RxUiActionControllers,
} from "../lib/rx.actions";

function getPrimaryActionController(
    rx: RxListItemDto,
    controllers: RxUiActionControllers,
) {
    const action = getRxUiAction(rx);

    if (!action) {
        return null;
    }

    return controllers[action] ?? null;
}

export function useRxPrimaryAction(input: {
    controllers: RxUiActionControllers;
}) {
    const { controllers } = input;

    const handlePrimaryAction = async (rx: RxListItemDto) => {
        const controller = getPrimaryActionController(rx, controllers);

        if (!controller) return;

        await controller.run(rx);
    };

    return {
        handlePrimaryAction,
    };
}