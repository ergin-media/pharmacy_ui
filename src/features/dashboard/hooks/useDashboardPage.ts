// src/features/dashboard/hooks/useDashboardPage.ts
import { useDashboardQuery } from "../queries/dashboard.queries";

export function useDashboardPage() {
    const query = useDashboardQuery();
    const data = query.data;

    const actions = {
        refresh: () => query.refetch(),
    };

    return {
        query,
        data,
        actions,
    };
}