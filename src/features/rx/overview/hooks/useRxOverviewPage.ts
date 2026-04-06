import { useMemo, useState } from "react";
import { useRxListQuery } from "../../queries/rx.queries";
import { useRxOverviewActions } from "./useRxOverviewActions";
import { rxMatchesOverviewFilters } from "../lib/rx-overview.filters";

export function useRxOverviewPage() {
    const [filters, setFilters] = useState({
        search: "",
        status: undefined,
        onlyAttention: false,
    });

    const query = useRxListQuery({
        page: 1,
        per_page: 25,
    });

    const overviewActions = useRxOverviewActions();

    const filteredItems = useMemo(() => {
        return (query.data?.items ?? []).filter((rx) =>
            rxMatchesOverviewFilters(rx, filters),
        );
    }, [query.data?.items, filters]);

    return {
        query,
        items: filteredItems,
        rawItems: query.data?.items ?? [],
        filters,
        setFilters,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error,
        page: query.data?.page ?? 1,
        perPage: query.data?.per_page ?? 25,
        totalPages: query.data?.total_pages ?? 1,

        activeActionId: overviewActions.activeActionId,

        actions: {
            runPrimaryAction: overviewActions.actions.runPrimaryAction,
        },
    };
}