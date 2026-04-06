import { useMemo, useState } from "react";

import { useRxListQuery } from "../../queries/rx.queries";
import { useRxOverviewActions } from "./useRxOverviewActions";
import { rxMatchesOverviewFilters } from "../lib/rx-overview.filters";
import type { RxOverviewStatus } from "../lib/rx-overview.status";

export function useRxOverviewPage() {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(25);

    const [filters, setFilters] = useState<{
        search: string;
        provider: string;
        status?: RxOverviewStatus | "open";
        onlyAttention: boolean;
    }>({
        search: "",
        provider: "",
        status: undefined,
        onlyAttention: false,
    });

    const query = useRxListQuery({
        page,
        per_page: perPage,
        provider: filters.provider || undefined,
        search: filters.search || undefined,
    });

    const overviewActions = useRxOverviewActions();

    const filteredItems = useMemo(() => {
        return (query.data?.items ?? []).filter((rx) =>
            rxMatchesOverviewFilters(rx, {
                search: filters.search,
                status: filters.status,
                onlyAttention: filters.onlyAttention,
            }),
        );
    }, [query.data?.items, filters]);

    return {
        query,
        items: filteredItems,
        rawItems: query.data?.items ?? [],
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error,
        page,
        perPage,
        total: query.data?.total ?? filteredItems.length,
        totalPages: query.data?.total_pages ?? 1,
        activeActionId: overviewActions.activeActionId,
        filters,
        actions: {
            runPrimaryAction: overviewActions.actions.runPrimaryAction,
            setPage,
            setPerPage,
            setSearch: (value: string) =>
                setFilters((prev) => ({
                    ...prev,
                    search: value,
                })),
            setProvider: (value: string) =>
                setFilters((prev) => ({
                    ...prev,
                    provider: value,
                })),
            setStatus: (value?: RxOverviewStatus | "open") =>
                setFilters((prev) => ({
                    ...prev,
                    status: value,
                })),
            setOnlyAttention: (value: boolean) =>
                setFilters((prev) => ({
                    ...prev,
                    onlyAttention: value,
                })),
        },
    };
}