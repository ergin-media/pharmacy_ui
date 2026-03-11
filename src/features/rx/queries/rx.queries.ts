import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { RxItem, RxListItemDto, RxListQueryParams } from "../types/rx.dto";
import { fetchRxList, reparseRx, takeOverRx } from "../api/rx.api";

export const rxKeys = {
    all: ["rx"] as const,
    lists: () => [...rxKeys.all, "list"] as const,

    // stabiler Key: nur primitive Werte (als Objekt ist ok, solange nur primitive Werte drin sind)
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
};

export function useRxListQuery(params: RxListQueryParams) {
    return useQuery({
        queryKey: rxKeys.list(params),
        queryFn: () => fetchRxList(params),

        // React Query v5: damit bleibt die vorherige Seite sichtbar beim Page-Wechsel
        placeholderData: (previousData) => previousData,
    });
}

export function useReparseRxMutation() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: reparseRx,

        onSuccess: (data) => {
            const updatedItem = data.item;

            // 🔥 Alle Rx-Listen patchen
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
        mutationFn: (id: number) => takeOverRx(id),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: rxKeys.lists() });
        },
    });
}
