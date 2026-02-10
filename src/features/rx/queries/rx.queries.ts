import { useQuery } from "@tanstack/react-query";
import type { RxListQueryParams } from "../types/rx.dto";
import { fetchRxList } from "../api/rx.api";

export const rxKeys = {
    all: ["rx"] as const,
    list: (params: RxListQueryParams) =>
        [...rxKeys.all, "list", params] as const,
};

export function useRxListQuery(params: RxListQueryParams) {
    return useQuery({
        queryKey: rxKeys.list(params),
        queryFn: () => fetchRxList(params),
        placeholderData: (previousData) => previousData,
    });
}
