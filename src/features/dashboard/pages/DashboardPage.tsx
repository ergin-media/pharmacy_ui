import { useState } from "react";

import { DashboardRevenueHero } from "../components/DashboardRevenueHero";
import { DashboardRiskCards } from "../components/DashboardRiskCards";
import { DashboardWorkflowBarChart } from "../components/DashboardWorkflowBarChart";
import { DashboardPaymentPieChart } from "../components/DashboardPaymentPieChart";
import { DashboardTopProductsBarChart } from "../components/DashboardTopProductsBarChart";
import { DashboardTopProvidersBarChart } from "../components/DashboardTopProvidersBarChart";
import { DashboardGrowthMessage } from "../components/DashboardGrowthMessage";
import { DashboardRevenueDailyBarChart } from "../components/DashboardRevenueDailyBarChart";
import { DashboardOrdersDailyBarChart } from "../components/DashboardOrdersDailyBarChart";

import { useDashboardPage } from "../hooks/useDashboardPage";
import { formatEUR } from "@/shared/lib/format/figures";
import { TypographyH1 } from "@/components/ui/typography";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export function DashboardPage() {
    const vm = useDashboardPage();
    const { data, isFetching, isError, error } = vm.query;

    const [dailyChartTab, setDailyChartTab] = useState<"revenue" | "orders">(
        "revenue",
    );

    if (isFetching && !data) {
        return <div>Lade Dashboard...</div>;
    }

    if (isError && !data) {
        return (
            <div className="text-sm text-destructive">
                Fehler: {(error as Error)?.message ?? "unknown"}
            </div>
        );
    }

    if (!data) {
        return <div className="p-6">Keine Daten verfügbar.</div>;
    }

    const d = data;

    const revenueDailyClean = vm.series.revenueDailyClean ?? [];
    const ordersDailyClean = vm.series.ordersDailyClean ?? [];
    const rangeLabel = vm.meta.rangeLabel;

    return (
        <div className="grid gap-4">
            {isError ? (
                <div className="rounded-lg bg-white p-3 text-sm text-destructive">
                    Hinweis: Dashboard konnte nicht aktualisiert werden – es
                    werden ggf. ältere Daten angezeigt.
                </div>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <TypographyH1 className="mb-1">Dashboard</TypographyH1>
                    <div className="text-xs text-muted-foreground">
                        Zeitraum:{" "}
                        <span className="font-medium text-foreground">
                            {rangeLabel}
                        </span>
                    </div>
                </div>

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

            {/* 2️⃣ Daily Chart Tabs */}
            <div className="rounded-lg bg-white p-4">
                <Tabs
                    value={dailyChartTab}
                    onValueChange={(v) =>
                        setDailyChartTab(v as "revenue" | "orders")
                    }
                >
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                            <div className="text-sm font-medium">
                                Tagesentwicklung
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Zeitraum: {rangeLabel}
                            </div>
                        </div>

                        <TabsList>
                            <TabsTrigger value="revenue">Umsätze</TabsTrigger>
                            <TabsTrigger value="orders">Bestellungen</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="revenue" className="mt-0">
                        {revenueDailyClean.length > 0 ? (
                            <DashboardRevenueDailyBarChart
                                data={revenueDailyClean}
                                rangeLabel={rangeLabel}
                                title="Umsatz pro Tag"
                            />
                        ) : (
                            <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
                                Noch keine Umsatzdaten verfügbar.
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="orders" className="mt-0">
                        {ordersDailyClean.length > 0 ? (
                            <DashboardOrdersDailyBarChart
                                data={ordersDailyClean}
                                rangeLabel={rangeLabel}
                                title="Bestellungen pro Tag"
                            />
                        ) : (
                            <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
                                Noch keine Bestelldaten verfügbar.
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-white p-4">
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

                <div className="rounded-lg bg-white p-4">
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

                <div className="rounded-lg bg-white p-4">
                    <div className="text-xs text-muted-foreground">
                        Offene Forderungen
                    </div>
                    <div className="text-2xl font-semibold">
                        {formatEUR(d.economy.open_receivables)}
                    </div>
                </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <DashboardTopProductsBarChart
                    products={d.analytics.top_products}
                />
                <DashboardTopProvidersBarChart
                    providers={d.analytics.top_providers}
                />
            </div>

            <DashboardRiskCards risk={d.risk} />

            <div className="grid gap-4 lg:grid-cols-2">
                <DashboardWorkflowBarChart workflow={d.operations.workflow} />
                <DashboardPaymentPieChart payment={d.operations.payment} />
            </div>
        </div>
    );
}