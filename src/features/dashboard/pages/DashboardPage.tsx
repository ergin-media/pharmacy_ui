import { DashboardRevenueHero } from "../components/DashboardRevenueHero";
import { DashboardRiskCards } from "../components/DashboardRiskCards";
import { DashboardWorkflowBarChart } from "../components/DashboardWorkflowBarChart";
import { DashboardPaymentPieChart } from "../components/DashboardPaymentPieChart";
import { DashboardTopProductsBarChart } from "../components/DashboardTopProductsBarChart";
import { DashboardTopProvidersBarChart } from "../components/DashboardTopProvidersBarChart";
import { DashboardGrowthMessage } from "../components/DashboardGrowthMessage";

import { useDashboardPage } from "../hooks/useDashboardPage";
import { DashboardRevenueDailyBarChart } from "../components/DashboardRevenueDailyBarChart";
import { formatEUR } from "@/shared/lib/format/figures";

export function DashboardPage() {
    const vm = useDashboardPage();
    const { data, isFetching, isError, error } = vm.query;

    // ✅ Loading nur wenn wirklich gar keine Daten da sind
    if (isFetching && !data) {
        return <div className="p-6">Lade Dashboard...</div>;
    }

    // ✅ Error nur "hard fail" wenn keine Daten vorhanden sind
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

    // ✅ kommt jetzt aus dem Hook (gefiltert + period-aware)
    const revenueDailyClean = vm.series.revenueDailyClean ?? [];
    const rangeLabel = vm.meta.rangeLabel;

    return (
        <div>
            {/* Soft Warning wenn Refetch failed aber stale data vorhanden */}
            {isError ? (
                <div className="rounded-xl border bg-white p-3 text-sm text-destructive">
                    Hinweis: Dashboard konnte nicht aktualisiert werden – es
                    werden ggf. ältere Daten angezeigt.
                </div>
            ) : null}

            {/* Header: Zeitraum */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <div className="text-lg font-semibold">Dashboard</div>
                    <div className="text-xs text-muted-foreground">
                        Zeitraum:{" "}
                        <span className="font-medium text-foreground">
                            {rangeLabel}
                        </span>
                    </div>
                </div>

                {/* Badge -> zeigt tatsächlich den gewählten Zeitraum */}
                <div className="rounded-full border bg-white px-3 py-1 text-xs text-muted-foreground">
                    {vm.period === "rolling_30d"
                        ? "Letzte 30 Tage"
                        : vm.period === "mtd"
                          ? "Monat bis heute"
                          : vm.period === "prev_month"
                            ? "Vormonat"
                            : "YTD"}
                </div>
            </div>

            {/* 1️⃣ Revenue Hero */}
            <DashboardRevenueHero
                revenueMonth={d.economy.revenue_month}
                revenuePrevMonth={d.economy.revenue_prev_month}
                revenueToday={d.economy.revenue_today}
                rxCountMonth={d.economy.rx_count_month}
                avgRxValue={d.economy.avg_rx_value_month}
                momPct={d.economy.revenue_vs_prev_month_pct}
            />

            <DashboardGrowthMessage
                momPct={d.economy.revenue_vs_prev_month_pct}
            />

            {/* 2️⃣ Revenue Chart */}
            {revenueDailyClean.length > 0 ? (
                <DashboardRevenueDailyBarChart
                    data={vm.series.revenueDailyClean}
                    rangeLabel={vm.meta.rangeLabel}
                    title="Umsatz pro Tag (letzte 30 Tage)"
                />
            ) : (
                <div className="rounded-xl border bg-white p-4 text-sm text-muted-foreground">
                    Noch keine Umsatzdaten verfügbar.
                </div>
            )}

            {/* 3️⃣ Cash Block */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border bg-white p-4">
                    <div className="text-xs text-muted-foreground">
                        Bezahlt (
                        {vm.period === "rolling_30d"
                            ? "letzte 30 Tage"
                            : "Zeitraum"}
                        )
                    </div>
                    <div className="text-2xl font-semibold">
                        {formatEUR(d.economy.revenue_paid_month)}
                    </div>
                </div>

                <div className="rounded-xl border bg-white p-4">
                    <div className="text-xs text-muted-foreground">
                        Unbezahlt (
                        {vm.period === "rolling_30d"
                            ? "letzte 30 Tage"
                            : "Zeitraum"}
                        )
                    </div>
                    <div className="text-2xl font-semibold">
                        {formatEUR(d.economy.revenue_unpaid_month)}
                    </div>
                </div>

                <div className="rounded-xl border bg-white p-4">
                    <div className="text-xs text-muted-foreground">
                        Offene Forderungen
                    </div>
                    <div className="text-2xl font-semibold">
                        {formatEUR(d.economy.open_receivables)}
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
                <DashboardWorkflowBarChart workflow={d.operations.workflow} />
                <DashboardPaymentPieChart payment={d.operations.payment} />
            </div>
        </div>
    );
}
