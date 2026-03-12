import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { RxListQueryParams } from "../types/rx.dto";
import { fetchRxList, reparseRx, takeOverRx } from "../api/rx.api";
import { removeRxFromListCache, replaceRxInListCache } from "../lib/rx.cache";
import { useToastMutation } from "@/shared/lib/react-query/create-toast-mutation";

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

    return useToastMutation({
        mutationFn: reparseRx,
        toastMessages: {
            loading: "Rezept wird neu verarbeitet...",
            success: "Rezept erfolgreich neu verarbeitet",
            error: "Rezept konnte nicht neu verarbeitet werden",
        },
        onSuccess: (data) => {
            replaceRxInListCache(qc, data.item);
        },
    });
}

export function useTakeOverRxMutation() {
    const qc = useQueryClient();

    return useToastMutation({
        mutationFn: takeOverRx,
        toastMessages: {
            loading: "Rezept wird übernommen...",
            success: "Rezept erfolgreich übernommen",
            error: "Rezept konnte nicht übernommen werden",
        },
        onSuccess: (_data, rxId) => {
            removeRxFromListCache(qc, rxId, {
                fromQueue: "inbox",
                toQueue: "offer_create",
            });
        },
    });
}