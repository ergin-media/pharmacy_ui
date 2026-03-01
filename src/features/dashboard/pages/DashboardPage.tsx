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

export function DashboardPage() {
    const vm = useDashboardPage();
    const { data, isFetching, isError, error } = vm.query;

    // ⏳ Initial Loading
    if (isFetching && !data) {
        return <div className="p-6">Lade Dashboard...</div>;
    }

    // ❌ Hard Error nur wenn KEINE Daten vorhanden
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

    // ✅ rolling_30d Serie
    const revenueDaily = vm.series.revenueDaily ?? [];

    // Optional: leere 0-Tage am Monatsanfang entfernen
    const revenueDailyClean = revenueDaily.filter(
        (row) => row.revenue_total !== 0 || row.rx_count !== 0
    );

    return (
        <div className="space-y-6 p-6">
            {/* Soft Warning wenn Refetch failed */}
            {isError ? (
                <div className="rounded-xl border bg-white p-3 text-sm text-destructive">
                    Hinweis: Dashboard konnte nicht aktualisiert werden – es werden ggf. ältere Daten angezeigt.
                </div>
            ) : null}

            {/* 1️⃣ Revenue Hero */}
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

            {/* 3️⃣ Cash Block */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border p-4 bg-white">
                    <div className="text-xs text-muted-foreground">
                        Bezahlt (30 Tage)
                    </div>
                    <div className="text-2xl font-semibold">
                        {d.economy.revenue_paid_month.toFixed(2)} €
                    </div>
                </div>

                <div className="rounded-xl border p-4 bg-white">
                    <div className="text-xs text-muted-foreground">
                        Unbezahlt (30 Tage)
                    </div>
                    <div className="text-2xl font-semibold">
                        {d.economy.revenue_unpaid_month.toFixed(2)} €
                    </div>
                </div>

                <div className="rounded-xl border p-4 bg-white">
                    <div className="text-xs text-muted-foreground">
                        Offene Forderungen
                    </div>
                    <div className="text-2xl font-semibold">
                        {d.economy.open_receivables.toFixed(2)} €
                    </div>
                </div>
            </div>

            {/* 4️⃣ Wachstumstreiber */}
            <div className="grid gap-6 lg:grid-cols-2">
                <DashboardTopProductsBarChart
                    products={d.analytics.top_products}
                />
                <DashboardTopProvidersBarChart
                    providers={d.analytics.top_providers}
                />
            </div>

            {/* 5️⃣ Risiko */}
            <DashboardRiskCards risk={d.risk} />

            {/* 6️⃣ Operatives */}
            <div className="grid gap-6 lg:grid-cols-2">
                <DashboardWorkflowBarChart
                    workflow={d.operations.workflow}
                />
                <DashboardPaymentPieChart
                    payment={d.operations.payment}
                />
            </div>
        </div>
    );
}