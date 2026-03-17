import {
    useMutation,
    useMutationState,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import type { RxItem, RxListItemDto, RxListQueryParams } from "../types/rx.dto";
import {
    fetchRxList,
    reparseRx,
    takeOverRx,
    assignRxMappings,
} from "../api/rx.api";

export const rxKeys = {
    all: ["rx"] as const,
    lists: () => [...rxKeys.all, "list"] as const,
    list: (p: RxListQueryParams) =>
        [
            ...rxKeys.lists(),
            {
                page: p.page ?? 1,
                per_page: p.per_page ?? 25,
                queue: p.queue ?? "",
                parse_status: p.parse_status ?? "",
                provider: p.provider ?? "",
                workflow_status: p.workflow_status ?? "",
                payment_state: p.payment_state ?? "",
                search: p.search ?? "",
                sort: p.sort ?? "created_at_desc",
            },
        ] as const,

    mutations: {
        reparse: () => [...rxKeys.all, "mutation", "reparse"] as const,
        takeOver: () => [...rxKeys.all, "mutation", "take-over"] as const,
        assignMappings: () =>
            [...rxKeys.all, "mutation", "assign-mappings"] as const,
    },
};

export function useRxListQuery(params: RxListQueryParams) {
    return useQuery({
        queryKey: rxKeys.list(params),
        queryFn: () => fetchRxList(params),
        placeholderData: (previousData) => previousData,
    });
}

export function useReparseRxMutation() {
    const qc = useQueryClient();

    return useMutation({
        mutationKey: rxKeys.mutations.reparse(),
        mutationFn: reparseRx,
        onSuccess: (data) => {
            const updatedItem = data.item;

            qc.setQueriesData(
                { queryKey: rxKeys.all },
                (old: any) => {
                    if (!old?.items) return old;

                    return {
                        ...old,
                        items: old.items.map((i: RxItem) =>
                            i.id === updatedItem.id ? updatedItem : i,
                        ),
                    };
                },
            );
        },
    });
}

export function useTakeOverRxMutation() {
    const qc = useQueryClient();

    return useMutation({
        mutationKey: rxKeys.mutations.takeOver(),
        mutationFn: takeOverRx,
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: rxKeys.lists() });
        },
    });
}

export function useAssignRxMappingsMutation() {
    const qc = useQueryClient();

    return useMutation({
        mutationKey: rxKeys.mutations.assignMappings(),
        mutationFn: assignRxMappings,
        onSuccess: (data) => {
            const updatedRx = data.rx;

            qc.setQueriesData(
                { queryKey: rxKeys.all },
                (old: any) => {
                    if (!old?.items) return old;

                    return {
                        ...old,
                        items: old.items.map((item: RxListItemDto) =>
                            item.id === updatedRx.id ? updatedRx : item,
                        ),
                    };
                },
            );
        },
    });
}

export function usePendingRxMutationIds(mutationKey: readonly unknown[]) {
    return useMutationState<number>({
        filters: {
            mutationKey,
            status: "pending",
        },
        select: (mutation) =>
            typeof mutation.state.variables === "number"
                ? mutation.state.variables
                : -1,
    }).filter((id) => id !== -1);
}