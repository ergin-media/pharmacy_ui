import {
    useMutation,
    useMutationState,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import type {
    RxItem,
    RxListItemDto,
    RxListQueryParams,
    RxListResponseDto,
} from "../types/rx.dto";
import {
    fetchRxList,
    reparseRx,
    takeOverRx,
    assignRxMappings,
} from "../api/rx.api";
import { useToastMutation } from "@/shared/lib/react-query/create-toast-mutation";
import { rxBelongsToQueue } from "../lib/rx.queue-matchers";
import type { RxQueue } from "../lib/rx.queues";

function getListParamsFromKey(
    queryKey: readonly unknown[],
): RxListQueryParams | null {
    const maybeParams = queryKey[2];

    if (!maybeParams || typeof maybeParams !== "object") {
        return null;
    }

    return maybeParams as RxListQueryParams;
}

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
        markPaid: () => [...rxKeys.all, "mutation", "mark-paid"] as const,
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
                (old: RxListItemDto) => {
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

    return useToastMutation({
        mutationKey: rxKeys.mutations.assignMappings(),
        mutationFn: assignRxMappings,
        toastMessages: {
            loading: "Zuordnungen werden gespeichert...",
            success: "Zuordnungen erfolgreich gespeichert",
            error: "Zuordnungen konnten nicht gespeichert werden",
        },
        onSuccess: async (data) => {
            const updatedRx = data.rx;

            const queries = qc.getQueriesData<RxListResponseDto>({
                queryKey: rxKeys.lists(),
            });

            for (const [queryKey, old] of queries) {
                if (!old?.items) continue;

                const params = getListParamsFromKey(queryKey);
                const queue = params?.queue as RxQueue | undefined;

                const belongs = rxBelongsToQueue(updatedRx, queue);

                const nextItems = belongs
                    ? old.items.map((item) =>
                          item.id === updatedRx.id ? updatedRx : item,
                      )
                    : old.items.filter((item) => item.id !== updatedRx.id);

                qc.setQueryData<RxListResponseDto>(queryKey, {
                    ...old,
                    items: nextItems,
                });
            }

            await qc.invalidateQueries({ queryKey: rxKeys.lists() });
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
