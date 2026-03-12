import {
    useReparseRxMutation,
    useTakeOverRxMutation,
} from "../queries/rx.queries";
import type {
    RxActionController,
    RxPrimaryActionControllers,
} from "../lib/rx.queue-actions";

function createMutationController(mutation: {
    mutateAsync: (id: number) => Promise<unknown>;
    isPending: boolean;
    variables?: unknown;
}): RxActionController {
    return {
        run: async (id: number) => {
            await mutation.mutateAsync(id);
        },
        isBusy: (id: number) =>
            mutation.isPending &&
            typeof mutation.variables === "number" &&
            mutation.variables === id,
    };
}

function createNoopController(label: string): RxActionController {
    return {
        run: async (id: number) => {
            console.warn(`${label} not implemented yet`, id);
        },
        isBusy: () => false,
    };
}

export function useRxListMutations(input?: {
    openOfferCreate?: (id: number) => void;
}) {
    const openOfferCreate = input?.openOfferCreate;

    const reparseMutation = useReparseRxMutation();
    const takeOverMutation = useTakeOverRxMutation();

    const reparse = createMutationController(reparseMutation);
    const inbox = createMutationController(takeOverMutation);

    const offerCreate: RxActionController = {
        run: (id: number) => {
            openOfferCreate?.(id);
        },
        isBusy: () => false,
    };

    const primary: RxPrimaryActionControllers = {
        inbox,
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
    };
}
