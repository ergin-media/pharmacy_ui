import { useRxOverviewActions } from "./useRxOverviewActions";
import { useRxOverviewData } from "./useRxOverviewData";
import { useRxOverviewFilters } from "./useRxOverviewFilters";

export function useRxOverviewPage() {
    const { filters, actions } = useRxOverviewFilters();

    const data = useRxOverviewData({
        page: filters.page,
        perPage: filters.perPage,
        provider: filters.provider,
        search: filters.search,
        status: filters.status,
        onlyAttention: filters.onlyAttention,
    });

    const overviewActions = useRxOverviewActions();

    return {
        query: data.query,
        items: data.items,
        rawItems: data.rawItems,
        total: data.total,
        totalPages: data.totalPages,

        isLoading: data.query.isLoading,
        isFetching: data.query.isFetching,
        isError: data.query.isError,
        error: data.query.error,

        page: filters.page,
        perPage: filters.perPage,
        filters,
        activeActionId: overviewActions.activeActionId,

        actions: {
            ...actions,
            runPrimaryAction: overviewActions.actions.runPrimaryAction,
            open: overviewActions.actions.open,
            delete: overviewActions.actions.delete,
        },
    };
}