// src/features/dashboard/pages/DashboardPage.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useDashboardQuery } from "../queries/dashboard.queries";
import { DashboardRevenueAreaChart } from "../components/DashboardRevenueAreaChart";
import { DashboardWorkflowBarChart } from "../components/DashboardWorkflowBarChart";
import { DashboardPaymentPieChart } from "../components/DashboardPaymentPieChart";
import { DashboardTopProductsBarChart } from "../components/DashboardTopProductsBarChart";

export function DashboardPage() {
    const query = useDashboardQuery();
    const d = query.data;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Dashboard</CardTitle>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => query.refetch()}
                    disabled={query.isFetching}
                >
                    Refresh
                </Button>
            </CardHeader>

            <CardContent className="space-y-4">
                {query.isError ? (
                    <div className="flex items-center gap-2">
                        <div className="text-sm text-destructive">
                            Fehler: {(query.error as Error)?.message ?? "unknown"}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => query.refetch()}
                        >
                            Erneut versuchen
                        </Button>
                    </div>
                ) : !d ? (
                    <div className="text-sm text-muted-foreground">
                        {query.isFetching ? "Lade…" : "Keine Daten."}
                    </div>
                ) : (
                    <>
                        {/* KPI Cards */}
                        <div className="grid gap-3 md:grid-cols-4">
                            <div className="rounded-xl border p-4">
                                <div className="text-xs text-muted-foreground">
                                    Umsatz Monat
                                </div>
                                <div className="text-2xl font-semibold">
                                    {d.economy.revenue_month.toFixed(2)} €
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    vs. Vormonat {d.economy.revenue_vs_prev_month_pct.toFixed(1)}%
                                </div>
                            </div>

                            <div className="rounded-xl border p-4">
                                <div className="text-xs text-muted-foreground">
                                    Offen (Monat)
                                </div>
                                <div className="text-2xl font-semibold">
                                    {d.economy.revenue_unpaid_month.toFixed(2)} €
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Forderungen: {d.economy.open_receivables.toFixed(2)} €
                                </div>
                            </div>

                            <div className="rounded-xl border p-4">
                                <div className="text-xs text-muted-foreground">
                                    RX (Monat)
                                </div>
                                <div className="text-2xl font-semibold">
                                    {d.economy.rx_count_month}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Ø Wert {d.economy.avg_rx_value_month.toFixed(2)} €
                                </div>
                            </div>

                            <div className="rounded-xl border p-4">
                                <div className="text-xs text-muted-foreground">
                                    Risk (gesamt)
                                </div>
                                <div className="text-2xl font-semibold">
                                    {d.risk.revenue_risk_total.toFixed(2)} €
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Patient Issues: {d.risk.rx_with_patient_issues}
                                </div>
                            </div>
                        </div>

                        {/* Charts Grid */}
                        <div className="grid gap-3 lg:grid-cols-3">
                            <div className="lg:col-span-2">
                                <DashboardRevenueAreaChart
                                    data={
                                        d.timeseries?.revenue_daily_current_month ??
                                        []
                                    }
                                />
                            </div>
                            <div className="lg:col-span-1 space-y-3">
                                <DashboardPaymentPieChart
                                    payment={d.operations.payment}
                                />
                                <DashboardWorkflowBarChart
                                    workflow={d.operations.workflow}
                                />
                            </div>
                        </div>

                        <div className="grid gap-3 lg:grid-cols-2">
                            <DashboardTopProductsBarChart
                                products={d.analytics.top_products ?? []}
                            />
                            {/* Top Providers kann ich dir als zweites Chart auch noch bauen */}
                            <div className="rounded-xl border p-4 text-sm text-muted-foreground">
                                Top Providers Chart folgt (wenn du willst).
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}