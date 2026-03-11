import {
    useReparseRxMutation,
    useTakeOverRxMutation,
} from "../queries/rx.queries";

export function useRxListMutations() {
    const reparseMutation = useReparseRxMutation();
    const takeOverMutation = useTakeOverRxMutation();

    const reparseBusyId =
        reparseMutation.isPending &&
        typeof reparseMutation.variables === "number"
            ? reparseMutation.variables
            : null;

    const takeOverBusyId =
        takeOverMutation.isPending &&
        typeof takeOverMutation.variables === "number"
            ? takeOverMutation.variables
            : null;

    const actions = {
        reparse: async (id: number) => {
            await reparseMutation.mutateAsync(id);
        },

        takeOver: async (id: number) => {
            await takeOverMutation.mutateAsync(id);
        },
    };

    return {
        actions,
        busy: {
            reparseBusyId,
            takeOverBusyId,
        },
        state: {
            isReparsePending: reparseMutation.isPending,
            isTakeOverPending: takeOverMutation.isPending,
        },
    };
}
