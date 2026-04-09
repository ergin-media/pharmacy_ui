import { useState } from "react";

import { useReparseRxMutation } from "../queries/rx.queries";
import { useMarkRxShippedMutation } from "../mark-shipped/queries/rx-mark-shipped.queries";
import { useMarkRxHandedOverMutation } from "../mark-handed-over/queries/rx-mark-handed-over.queries";

import type { RxListItemDto } from "../types/rx.dto";
import type {
    RxActionController,
    RxUiActionControllers,
} from "../lib/rx.actions";

export function useRxListMutations(input?: {
    openOfferCreate?: (rx: RxListItemDto) => void;
    openShippingReady?: (rx: RxListItemDto) => void;
    openPickupReady?: (rx: RxListItemDto) => void;
}) {
    const openOfferCreate = input?.openOfferCreate;
    const openShippingReady = input?.openShippingReady;
    const openPickupReady = input?.openPickupReady;

    const reparseMutation = useReparseRxMutation();
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

    const reviewAttention: RxActionController = {
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

    const createOffer: RxActionController = {
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

    const markShippingReady: RxActionController = {
        run: async (rx: RxListItemDto) => {
            const id = Number(rx.id);
            setActivePrimaryActionId(id);

            try {
                openShippingReady?.(rx);
            } finally {
                setActivePrimaryActionId(null);
            }
        },
    };

    const markPickupReady: RxActionController = {
        run: async (rx: RxListItemDto) => {
            const id = Number(rx.id);
            setActivePrimaryActionId(id);

            try {
                openPickupReady?.(rx);
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
        review_attention: reviewAttention,
        create_offer: createOffer,
        mark_shipping_ready: markShippingReady,
        mark_pickup_ready: markPickupReady,
        mark_shipped: markShipped,
        mark_picked_up: markPickedUp,
    };

    return {
        reparse,
        actions,
        primaryActionState: {
            isPending: activePrimaryActionId !== null,
            activeId: activePrimaryActionId,
        },
    };
}
