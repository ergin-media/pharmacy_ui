import { useState } from "react";

import {
    useReparseRxMutation,
    useTakeOverRxMutation,
} from "../queries/rx.queries";

import type { RxListItemDto } from "../types/rx.dto";

import type {
    RxActionController,
    RxPrimaryActionControllers,
} from "../lib/rx.queue-actions";

function createNoopController(label: string): RxActionController {
    return {
        run: async (rx: RxListItemDto) => {
            console.warn(`${label} not implemented yet`, rx.id);
        },
    };
}

export function useRxListMutations(input?: {
    openOfferCreate?: (rx: RxListItemDto) => void;
}) {
    const openOfferCreate = input?.openOfferCreate;

    const reparseMutation = useReparseRxMutation();
    const takeOverMutation = useTakeOverRxMutation();

    const [activePrimaryActionId, setActivePrimaryActionId] = useState<
        number | null
    >(null);

    const reparse = {
        run: async (id: number) => {
            await reparseMutation.mutateAsync(id);
        },

        isBusy: (id: number) =>
            reparseMutation.isPending &&
            typeof reparseMutation.variables === "number" &&
            reparseMutation.variables === id,
    };

    const takeOver: RxActionController = {
        run: async (rx: RxListItemDto) => {
            const id = Number(rx.id);

            setActivePrimaryActionId(id);

            try {
                await takeOverMutation.mutateAsync(id);
            } finally {
                setActivePrimaryActionId(null);
            }
        },
    };

    const offerCreate: RxActionController = {
        run: async (rx: RxListItemDto) => {
            const id = Number(rx.id);

            setActivePrimaryActionId(id);

            try {
                openOfferCreate?.(rx);
            } finally {
                setActivePrimaryActionId(null);
            }
        },
    };

    const primary: RxPrimaryActionControllers = {
        inbox: takeOver,
        offer_create: offerCreate,
        await_payment: createNoopController("confirmPayment"),
        paid_not_started: createNoopController("startPackaging"),
        packaging: createNoopController("finishPackaging"),
        shipping: createNoopController("markShipped"),
        pickup: createNoopController("markPickedUp"),
    };

    return {
        reparse,
        primary,
        primaryActionState: {
            isPending: activePrimaryActionId !== null,
            activeId: activePrimaryActionId,
        },
    };
}
