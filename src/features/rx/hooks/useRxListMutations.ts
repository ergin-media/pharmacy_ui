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
    RxUiActionControllers,
} from "../lib/rx.actions";

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

    const resolveAttention: RxActionController = {
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

    const startProcessing: RxActionController = {
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

    const finishPreparation: RxActionController = {
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

    const markPickedUp: RxActionController = {
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

    const actions: RxUiActionControllers = {
        resolve_attention: resolveAttention,
        offer_create: offerCreate,
        start_processing: startProcessing,
        finish_preparation: finishPreparation,
        mark_shipped: markShipped,
        mark_picked_up: markPickedUp,
    };

    return {
        reparse,
        actions,
        internal: {
            markReady,
        },
        primaryActionState: {
            isPending: activePrimaryActionId !== null,
            activeId: activePrimaryActionId,
        },
    };
}
