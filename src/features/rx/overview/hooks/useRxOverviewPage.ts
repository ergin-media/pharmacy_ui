import { useRxListQuery } from "../../queries/rx.queries";
import { useRxOverviewActions } from "./useRxOverviewActions";

export function useRxOverviewPage() {
    const query = useRxListQuery({
        page: 1,
        per_page: 25,
    });

    const overviewActions = useRxOverviewActions();

    return {
        query,
        items: query.data?.items ?? [],
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