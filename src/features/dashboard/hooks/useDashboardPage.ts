import { useMemo } from "react";
import { useSearchParams } from "react-router";
import { spGetString, spSetOrDelete } from "@/shared/lib/url/searchParams";
import { useDashboardQuery } from "../queries/dashboard.queries";
import type { DashboardPeriod } from "../types/dashboard.dto";

const PERIODS = ["rolling_30d", "mtd", "prev_month", "ytd"] as const;

function normalizePeriod(v: string | null): DashboardPeriod {
    const s = (v ?? "").trim();
    return (PERIODS as readonly string[]).includes(s) ? (s as DashboardPeriod) : "rolling_30d";
}

export function useDashboardPage() {
    const [sp, setSp] = useSearchParams();

    const period = normalizePeriod(spGetString(sp, "period"));

    const params = useMemo(() => ({ period }), [period]);
    const query = useDashboardQuery(params);

    const actions = {
        setPeriod: (next: DashboardPeriod) => {
            const n = new URLSearchParams(sp);
            spSetOrDelete(n, "period", next);
            setSp(n, { replace: true });
        },
        refresh: () => query.refetch(),
    };

    // ✅ Chart-Daten: rolling_30d nimmt revenue_daily, sonst fallback auf current_month
    const revenueSeries =
        (query.data?.timeseries?.revenue_daily ?? query.data?.timeseries?.revenue_daily_current_month ?? []) ?? [];

    return {
        period,
        query,
        series: {
            revenueDaily: revenueSeries,
        },
        actions,
    };
}