// src/features/dashboard/hooks/useDashboardPage.ts
import { useMemo } from "react";
import { useDashboardQuery } from "../queries/dashboard.queries";
import type { DashboardPeriod } from "../types/dashboard.dto";

const DEFAULT_PERIOD: DashboardPeriod = "rolling_30d";

export function useDashboardPage() {
    const period = DEFAULT_PERIOD;

    const params = useMemo(() => ({ period }), [period]);
    const query = useDashboardQuery(params);

    const ts = query.data?.timeseries;

    // ✅ rolling_30d "Hauptchart"
    const revenueDaily = ts?.revenue_daily ?? [];

    return {
        period,
        query,
        series: {
            revenueDaily,
            revenueCompareAligned: ts?.revenue_daily_compare_aligned ?? [],
        },
        actions: {
            refresh: () => query.refetch(),
        },
    };
}