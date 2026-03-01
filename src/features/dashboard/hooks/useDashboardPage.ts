// src/features/dashboard/hooks/useDashboardPage.ts
"use client";

import { useMemo } from "react";
import { useSearchParams } from "react-router";
import { spGetString, spSetOrDelete } from "@/shared/lib/url/searchParams";
import { useDashboardQuery } from "../queries/dashboard.queries";
import type { DashboardPeriod, DashboardTimeSeriesPointDto } from "../types/dashboard.dto";
import { formatDate } from "@/shared/lib/format/date";

const PERIODS = ["rolling_30d", "mtd", "prev_month", "ytd"] as const;
const DEFAULT_PERIOD: DashboardPeriod = "rolling_30d";

function normalizePeriod(v: string | null): DashboardPeriod {
    const s = (v ?? "").trim();
    return (PERIODS as readonly string[]).includes(s) ? (s as DashboardPeriod) : DEFAULT_PERIOD;
}

function pickRevenueSeries(
    period: DashboardPeriod,
    ts?: {
        revenue_daily?: DashboardTimeSeriesPointDto[];
        revenue_daily_current_month?: DashboardTimeSeriesPointDto[];
        revenue_daily_prev_month?: DashboardTimeSeriesPointDto[];
    },
): DashboardTimeSeriesPointDto[] {
    if (!ts) return [];

    if (period === "rolling_30d") return ts.revenue_daily ?? [];
    if (period === "mtd") return ts.revenue_daily_current_month ?? [];
    if (period === "prev_month") return ts.revenue_daily_prev_month ?? [];

    // ytd: falls du (noch) keine eigene ytd-serie lieferst -> fallback rolling_30d
    return ts.revenue_daily ?? [];
}

export function useDashboardPage() {
    const [sp, setSp] = useSearchParams();

    const period = normalizePeriod(spGetString(sp, "period"));
    const params = useMemo(() => ({ period }), [period]);

    const query = useDashboardQuery(params);

    const actions = {
        setPeriod: (next: DashboardPeriod) => {
            const n = new URLSearchParams(sp);

            // Default nicht in URL schreiben
            if (next === DEFAULT_PERIOD) spSetOrDelete(n, "period", "");
            else spSetOrDelete(n, "period", next);

            setSp(n, { replace: true });
        },
        refresh: () => query.refetch(),
    };

    const ts = query.data?.timeseries;

    // ✅ 1) Serie wählen (period-aware)
    const revenueDaily = pickRevenueSeries(period, ts);

    // ✅ 2) Optional: 0-Tage raus (gut am Monatsanfang / “noch keine Aktivität”)
    const revenueDailyClean = useMemo(
        () => revenueDaily.filter((row) => row.revenue_total !== 0 || row.rx_count !== 0),
        [revenueDaily],
    );

    // ✅ 3) Zeitraum labeln (CFO-Feeling)
    const rangeStart = revenueDaily[0]?.date;
    const rangeEnd = revenueDaily[revenueDaily.length - 1]?.date;

    const rangeLabel = useMemo(() => {
        if (rangeStart && rangeEnd) return `${formatDate(rangeStart)} – ${formatDate(rangeEnd)}`;
        return period === "rolling_30d" ? "Letzte 30 Tage" : "Zeitraum";
    }, [rangeStart, rangeEnd, period]);

    const hasOnlyZeros = revenueDaily.length > 0 && revenueDailyClean.length === 0;

    return {
        period,
        query,
        series: {
            revenueDaily, // raw
            revenueDailyClean, // gefiltert
            revenueCompareAligned: ts?.revenue_daily_compare_aligned ?? [],
        },
        meta: {
            rangeStart,
            rangeEnd,
            rangeLabel,
            hasOnlyZeros,
        },
        actions,
    };
}