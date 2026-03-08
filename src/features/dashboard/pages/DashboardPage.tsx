import { DashboardRevenueHero } from "../components/DashboardRevenueHero";
import { DashboardRiskCards } from "../components/DashboardRiskCards";
import { DashboardWorkflowBarChart } from "../components/DashboardWorkflowBarChart";
import { DashboardPaymentPieChart } from "../components/DashboardPaymentPieChart";
import { DashboardTopProductsBarChart } from "../components/DashboardTopProductsBarChart";
import { DashboardTopProvidersBarChart } from "../components/DashboardTopProvidersBarChart";
import { DashboardGrowthMessage } from "../components/DashboardGrowthMessage";
import { DashboardDailyActivityCard } from "../components/DashboardDailyActivityCard";
import { DashboardCashCards } from "../components/DashboardCashCards";
import { DashboardPageSkeleton } from "../components/DashboardPageSkeleton";

import { useDashboardPage } from "../hooks/useDashboardPage";
import { TypographyH1 } from "@/components/ui/typography";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "../components/DashboardHeader";

function getPeriodLabel(period: ReturnType<typeof useDashboardPage>["period"]) {
    if (period === "rolling_30d") return "Letzte 30 Tage";
    if (period === "mtd") return "Monat bis heute";
    if (period === "prev_month") return "Vormonat";
    return "YTD";
}

export function DashboardPage() {
    const vm = useDashboardPage();
    const { data, isFetching, isError, error } = vm.query;

    const rangeLabel = vm.meta.rangeLabel;
    const isLoading = isFetching && !data;

    return (
        <div className="grid gap-4">
            {/* Header */}
            <DashboardHeader
                title="Dashboard"
                rangeLabel={rangeLabel}
                period={vm.period}
                loading={isLoading}
            />

            {/* Initial loading */}
            {isLoading ? <DashboardPageSkeleton /> : null}

            {/* Hard error */}
            {isError && !data ? (
                <div className="text-sm text-destructive">
                    Fehler: {(error as Error)?.message ?? "unknown"}
                </div>
            ) : null}

            {!data ? null : (
                <>
                    {/* Soft error (stale data) */}
                    {isError ? (
                        <div className="rounded-lg bg-white p-3 text-sm text-destructive">
                            Hinweis: Dashboard konnte nicht aktualisiert werden –
                            es werden ggf. ältere Daten angezeigt.
                        </div>
                    ) : null}

                    <DashboardRevenueHero
                        revenueMonth={data.economy.revenue_month}
                        revenuePrevMonth={data.economy.revenue_prev_month}
                        revenueToday={data.economy.revenue_today}
                        rxCountToday={data.economy.rx_count_today}
                        rxCountMonth={data.economy.rx_count_month}
                        avgRxValue={data.economy.avg_rx_value_month}
                        momPct={data.economy.revenue_vs_prev_month_pct}
                    />

                    <DashboardGrowthMessage
                        momPct={data.economy.revenue_vs_prev_month_pct}
                    />

                    <DashboardDailyActivityCard
                        rangeLabel={rangeLabel}
                        revenueDaily={vm.series.revenueDailyClean ?? []}
                        ordersDaily={vm.series.ordersDailyClean ?? []}
                    />

                    <DashboardCashCards
                        period={vm.period}
                        revenuePaid={data.economy.revenue_paid_month}
                        revenueUnpaid={data.economy.revenue_unpaid_month}
                        openReceivables={data.economy.open_receivables}
                    />

                    <div className="grid gap-4 lg:grid-cols-2">
                        <DashboardTopProductsBarChart
                            products={data.analytics.top_products}
                        />
                        <DashboardTopProvidersBarChart
                            providers={data.analytics.top_providers}
                        />
                    </div>

                    <DashboardRiskCards risk={data.risk} />

                    <div className="grid gap-4 lg:grid-cols-2">
                        <DashboardWorkflowBarChart
                            workflow={data.operations.workflow}
                        />
                        <DashboardPaymentPieChart
                            payment={data.operations.payment}
                        />
                    </div>
                </>
            )}
        </div>
    );
}