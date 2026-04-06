import { useMemo } from "react";

import { useRxListQuery } from "../../queries/rx.queries";
import type { RxListQueryParams } from "../../types/rx.dto";
import { rxMatchesOverviewFilters } from "../lib/rx-overview.filters";
import type { RxOverviewStatus } from "../lib/rx-overview.status";

export function useRxOverviewData(input: {
    page: number;
    perPage: number;
    provider?: string;
    search?: string;
    status?: RxOverviewStatus | "open";
    onlyAttention: boolean;
}) {
    const { page, perPage, provider, search, status, onlyAttention } = input;

    const params = useMemo<RxListQueryParams>(
        () => ({
            page,
            per_page: perPage,
            provider,
            search,
            sort: "created_at_desc",
        }),
        [page, perPage, provider, search],
    );

    const query = useRxListQuery(params);

    const rawItems = query.data?.items ?? [];

    const items = useMemo(() => {
        return rawItems.filter((rx) =>
            rxMatchesOverviewFilters(rx, {
                search,
                status,
                onlyAttention,
            }),
        );
    }, [rawItems, search, status, onlyAttention]);

    const total = query.data?.total ?? 0;
    const totalPages =
        query.data?.total_pages && query.data.total_pages > 0
            ? query.data.total_pages
            : 1;

    return {
        params,
        query,
        rawItems,
        items,
        total,
        totalPages,
    };
}