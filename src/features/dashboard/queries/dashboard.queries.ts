// src/features/dashboard/queries/dashboard.queries.ts
import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "../api/dashboard.api";

export const dashboardKeys = {
    all: ["dashboard"] as const,
    summary: () => [...dashboardKeys.all, "summary"] as const,
};

export function useDashboardQuery() {
    return useQuery({
        queryKey: dashboardKeys.summary(),
        queryFn: () => fetchDashboard(),
        staleTime: 30_000, // Dashboard darf ruhig etwas cachen
        refetchInterval: 60_000, // optional: alle 60s aktualisieren
    });
}