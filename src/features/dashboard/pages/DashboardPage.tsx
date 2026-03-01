"use client";

import { DashboardRevenueHero } from "../components/DashboardRevenueHero";
import { DashboardRiskCards } from "../components/DashboardRiskCards";
import { DashboardWorkflowBarChart } from "../components/DashboardWorkflowBarChart";
import { DashboardPaymentPieChart } from "../components/DashboardPaymentPieChart";
import { DashboardTopProductsBarChart } from "../components/DashboardTopProductsBarChart";
import { DashboardTopProvidersBarChart } from "../components/DashboardTopProvidersBarChart";
import { DashboardGrowthMessage } from "../components/DashboardGrowthMessage";
import { DashboardRevenueCurrentMonthBarChart } from "../components/DashboardRevenueCurrentMonthBarChart";

import { useDashboardPage } from "../hooks/useDashboardPage";

function formatDEDate(isoDate: string) {
    // isoDate: "2026-02-28"
    const d = new Date(`${isoDate}T00:00:00`);
    return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
}

export function DashboardPage() {
    const vm = useDashboardPage();
    const { data, isFetching, isError, error } = vm.query;

    if (isFetching && !data) {
        return <div className="p-6">Lade Dashboard...</div>;
    }

    if (isError && !data) {
        return (
            <div className="p-6">
                <div className="text-sm text-destructive">
                    Fehler: {(error as Error)?.message ?? "unknown"}
                </div>
            </div>
        );
    }

    if (!data) {
        return <div className="p-6">Keine Daten verfügbar.</div>;
    }

    const d = data;

    const revenueDaily = vm.series.revenueDaily ?? [];

    // Optional: leere 0-Tage am Monatsanfang rausfiltern
    const revenueDailyClean = revenueDaily.filter(
        (row) => row.revenue_total !== 0 || row.rx_count !== 0,
    );

    // Zeitraum aus Serie ableiten (für CFO-Feeling)
    const rangeStart = revenueDaily[0]?.date;
    const rangeEnd = revenueDaily[revenueDaily.length - 1]?.date;
    const rangeLabel =
        rangeStart && rangeEnd
            ? `${formatDEDate(rangeStart)} – ${formatDEDate(rangeEnd)}`
            : "Letzte 30 Tage";

    return (
        <div className="space-y-6 p-6">
            {/* Soft Warning wenn Refetch failed */}
            {isError ? (
                <div className="rounded-xl border bg-white p-3 text-sm text-destructive">
                    Hinweis: Dashboard konnte nicht aktualisiert werden – es werden ggf.
                    ältere Daten angezeigt.
                </div>
            ) : null}

            {/* Header: Zeitraum */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <div className="text-lg font-semibold">Dashboard</div>
                    <div className="text-xs text-muted-foreground">
                        Zeitraum: <span className="font-medium text-foreground">{rangeLabel}</span>
                    </div>
                </div>

                <div className="rounded-full border bg-white px-3 py-1 text-xs text-muted-foreground">
                    Letzte 30 Tage
                </div>
            </div>

            {/* 1️⃣ Revenue Hero (Semantik: rolling 30d) */}
            <DashboardRevenueHero
                revenueMonth={d.economy.revenue_month}
                revenuePrevMonth={d.economy.revenue_prev_month}
                revenueToday={d.economy.revenue_today}
                rxCountMonth={d.economy.rx_count_month}
                avgRxValue={d.economy.avg_rx_value_month}
                momPct={d.economy.revenue_vs_prev_month_pct}
            />

            <DashboardGrowthMessage momPct={d.economy.revenue_vs_prev_month_pct} />

            {/* 2️⃣ Revenue Chart (rolling_30d) */}
            {revenueDailyClean.length > 0 ? (
                <DashboardRevenueCurrentMonthBarChart data={revenueDailyClean} />
            ) : (
                <div className="rounded-xl border bg-white p-4 text-sm text-muted-foreground">
                    Noch keine Umsatzdaten verfügbar.
                </div>
            )}

            {/* 3️⃣ Cash Block (rolling_30d wording) */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border p-4 bg-white">
                    <div className="text-xs text-muted-foreground">Bezahlt (letzte 30 Tage)</div>
                    <div className="text-2xl font-semibold">
                        {d.economy.revenue_paid_month.toFixed(2)} €
                    </div>
                </div>

                <div className="rounded-xl border p-4 bg-white">
                    <div className="text-xs text-muted-foreground">Unbezahlt (letzte 30 Tage)</div>
                    <div className="text-2xl font-semibold">
                        {d.economy.revenue_unpaid_month.toFixed(2)} €
                    </div>
                </div>

                <div className="rounded-xl border p-4 bg-white">
                    <div className="text-xs text-muted-foreground">Offene Forderungen</div>
                    <div className="text-2xl font-semibold">
                        {d.economy.open_receivables.toFixed(2)} €
                    </div>
                </div>
            </div>

            {/* 4️⃣ Wachstumstreiber */}
            <div className="grid gap-6 lg:grid-cols-2">
                <DashboardTopProductsBarChart products={d.analytics.top_products} />
                <DashboardTopProvidersBarChart providers={d.analytics.top_providers} />
            </div>

            {/* 5️⃣ Risiko */}
            <DashboardRiskCards risk={d.risk} />

            {/* 6️⃣ Operatives */}
            <div className="grid gap-6 lg:grid-cols-2">
                <DashboardWorkflowBarChart workflow={d.operations.workflow} />
                <DashboardPaymentPieChart payment={d.operations.payment} />
            </div>
        </div>
    );
}