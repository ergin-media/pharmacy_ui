// src/features/dashboard/pages/DashboardPage.tsx
"use client";

import { useDashboardQuery } from "../queries/dashboard.queries";

import { DashboardRevenueHero } from "../components/DashboardRevenueHero";
import { DashboardRevenueAreaChart } from "../components/DashboardRevenueAreaChart";
import { DashboardRiskCards } from "../components/DashboardRiskCards";
import { DashboardWorkflowBarChart } from "../components/DashboardWorkflowBarChart";
import { DashboardPaymentPieChart } from "../components/DashboardPaymentPieChart";
import { DashboardTopProductsBarChart } from "../components/DashboardTopProductsBarChart";
import { DashboardTopProvidersBarChart } from "../components/DashboardTopProvidersBarChart";
import { DashboardGrowthMessage } from "../components/DashboardGrowthMessage";

export function DashboardPage() {
    const { data, isLoading } = useDashboardQuery();

    if (isLoading || !data) {
        return <div className="p-6">Lade Dashboard...</div>;
    }

    const d = data;

    return (
        <div className="space-y-6 p-6">

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

            {/* 2️⃣ Revenue Chart */}
            <DashboardRevenueAreaChart
                data={d.timeseries.revenue_daily_compare_aligned}
            />

            {/* 3️⃣ Cash Block */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border p-4">
                    <div className="text-xs text-muted-foreground">Bezahlt (Monat)</div>
                    <div className="text-2xl font-semibold">
                        {d.economy.revenue_paid_month.toFixed(2)} €
                    </div>
                </div>

                <div className="rounded-xl border p-4">
                    <div className="text-xs text-muted-foreground">Unbezahlt (Monat)</div>
                    <div className="text-2xl font-semibold">
                        {d.economy.revenue_unpaid_month.toFixed(2)} €
                    </div>
                </div>

                <div className="rounded-xl border p-4">
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