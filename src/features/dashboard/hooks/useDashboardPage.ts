// src/features/dashboard/hooks/useDashboardPage.ts
import { useDashboardQuery } from "../queries/dashboard.queries";

export function useDashboardPage() {
    const query = useDashboardQuery();

    return {
        query,
        data: query.data,
        meta: query.data?._meta,
        actions: {
            refresh: () => query.refetch(),
        },
    };
}