import { useQuery } from "@tanstack/react-query";
import type { DashboardQueryParams } from "../types/dashboard.dto";
import { fetchDashboard } from "../api/dashboard.api";

export const dashboardKeys = {
    all: ["dashboard"] as const,
    overview: (params: DashboardQueryParams) =>
        [...dashboardKeys.all, "overview", params] as const,
};

export function useDashboardQuery(params: DashboardQueryParams) {
    return useQuery({
        queryKey: dashboardKeys.overview(params),
        queryFn: () => fetchDashboard(params),
        staleTime: 10_000,
    });
}