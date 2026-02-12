import { useQuery } from "@tanstack/react-query";
import type { RxListQueryParams } from "../types/rx.dto";
import { fetchRxList } from "../api/rx.api";

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
                parse_status: p.parse_status ?? "",
                provider: p.provider ?? "",
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
