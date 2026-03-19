import { useState } from "react";

import {
    useReparseRxMutation,
    useTakeOverRxMutation,
} from "../queries/rx.queries";
import { useStartRxPackagingMutation } from "../start-packaging/queries/rx-start-packaging.queries";
import { useMarkRxReadyMutation } from "../mark-ready/queries/rx-mark-ready.queries";
import { useMarkRxShippedMutation } from "../mark-shipped/queries/rx-mark-shipped.queries";
import { useMarkRxHandedOverMutation } from "../mark-handed-over/queries/rx-mark-handed-over.queries";

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
    const startPackagingMutation = useStartRxPackagingMutation();
    const markReadyMutation = useMarkRxReadyMutation();
    const markShippedMutation = useMarkRxShippedMutation();
    const markHandedOverMutation = useMarkRxHandedOverMutation();

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

    const startPackaging: RxActionController = {
        run: async (rx: RxListItemDto) => {
            const id = Number(rx.id);

            setActivePrimaryActionId(id);

            try {
                await startPackagingMutation.mutateAsync({ id });
            } finally {
                setActivePrimaryActionId(null);
            }
        },
    };

    const markReady: RxActionController = {
        run: async (rx: RxListItemDto) => {
            const id = Number(rx.id);
            const fulfillmentType =
                rx.fulfillment_type === "shipping" ? "shipping" : "pickup";

            setActivePrimaryActionId(id);

            try {
                await markReadyMutation.mutateAsync({
                    id,
                    fulfillment_type: fulfillmentType,
                });
            } finally {
                setActivePrimaryActionId(null);
            }
        },
    };

    const markShipped: RxActionController = {
        run: async (rx: RxListItemDto) => {
            const id = Number(rx.id);

            setActivePrimaryActionId(id);

            try {
                await markShippedMutation.mutateAsync({ id });
            } finally {
                setActivePrimaryActionId(null);
            }
        },
    };

    const markHandedOver: RxActionController = {
        run: async (rx: RxListItemDto) => {
            const id = Number(rx.id);

            setActivePrimaryActionId(id);

            try {
                await markHandedOverMutation.mutateAsync({ id });
            } finally {
                setActivePrimaryActionId(null);
            }
        },
    };

    const primary: RxPrimaryActionControllers = {
        inbox: takeOver,
        offer_create: offerCreate,
        await_payment: createNoopController("confirmPayment"),
        paid_not_started: startPackaging,
        packaging: markReady,
        shipping: markShipped,
        pickup: markHandedOver,
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