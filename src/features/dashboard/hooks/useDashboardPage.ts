"use client";

import { useMemo } from "react";
import { useDashboardQuery } from "../queries/dashboard.queries";
import type { DashboardPeriod } from "../types/dashboard.dto";

const PERIOD: DashboardPeriod = "rolling_30d";

export function useDashboardPage() {
    const params = useMemo(() => ({ period: PERIOD }), []);
    const query = useDashboardQuery(params);

    const ts = query.data?.timeseries;

    // ✅ rolling_30d: immer revenue_daily als Hauptserie
    const revenueDaily = ts?.revenue_daily ?? [];

    return {
        period: PERIOD,
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