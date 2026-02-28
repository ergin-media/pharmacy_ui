// src/features/dashboard/queries/dashboard.queries.ts
import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "../api/dashboard.api";

export const dashboardKeys = {
    all: ["dashboard"] as const,
};

export function useDashboardQuery() {
    return useQuery({
        queryKey: dashboardKeys.all,
        queryFn: () => fetchDashboard(),
        staleTime: 30_000,
        refetchInterval: 60_000, // optional: passt zu deinem cache ttl=60
    });
}