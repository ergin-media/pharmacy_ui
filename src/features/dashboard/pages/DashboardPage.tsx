// src/features/dashboard/pages/DashboardPage.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useDashboardPage } from "../hooks/useDashboardPage";
import { DashboardKpiGrid } from "../components/DashboardKpiGrid";
import { DashboardRevenueAreaChart } from "../components/DashboardRevenueAreaChart";
import { DashboardPaymentPieChart } from "../components/DashboardPaymentPieChart";
import { DashboardWorkflowBarChart } from "../components/DashboardWorkflowBarChart";
import { DashboardTopProductsBarChart } from "../components/DashboardTopProductsBarChart";
import { DashboardTopProvidersBarChart } from "../components/DashboardTopProvidersBarChart";
import { DashboardRiskBarChart } from "../components/DashboardRiskBarChart";

export function DashboardPage() {
    const vm = useDashboardPage();
    const d = vm.data;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Dashboard</CardTitle>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={vm.actions.refresh}
                    disabled={vm.query.isFetching}
                >
                    Refresh
                </Button>
            </CardHeader>

            <CardContent className="space-y-4">
                {vm.query.isError ? (
                    <div className="flex items-center gap-2">
                        <div className="text-sm text-destructive">
                            Fehler: {(vm.query.error as Error)?.message ?? "unknown"}
                        </div>
                        <Button variant="outline" size="sm" onClick={vm.actions.refresh}>
                            Erneut versuchen
                        </Button>
                    </div>
                ) : !d ? (
                    <div className="text-sm text-muted-foreground">
                        {vm.query.isFetching ? "Lade…" : "Keine Daten."}
                    </div>
                ) : (
                    <>
                        <DashboardKpiGrid
                            economy={d.economy}
                            analytics={d.analytics}
                            risk={{
                                revenue_risk_total: d.risk.revenue_risk_total,
                                rx_with_patient_issues: d.risk.rx_with_patient_issues,
                                rx_with_unmapped_items: d.risk.rx_with_unmapped_items,
                                rx_with_pricing_base_price_missing:
                                    d.risk.rx_with_pricing_base_price_missing,
                            }}
                        />

                        <div className="grid gap-3 lg:grid-cols-3">
                            <div className="lg:col-span-2">
                                <DashboardRevenueAreaChart
                                    data={d.timeseries?.revenue_daily_current_month ?? []}
                                />
                            </div>

                            <div className="space-y-3 lg:col-span-1">
                                <DashboardPaymentPieChart payment={d.operations.payment} />
                                <DashboardWorkflowBarChart workflow={d.operations.workflow} />
                            </div>
                        </div>

                        <div className="grid gap-3 lg:grid-cols-3">
                            <div className="lg:col-span-1">
                                <DashboardRiskBarChart risk={d.risk} />
                            </div>
                            <div className="lg:col-span-2 grid gap-3 lg:grid-cols-2">
                                <DashboardTopProductsBarChart products={d.analytics.top_products ?? []} />
                                <DashboardTopProvidersBarChart providers={d.analytics.top_providers ?? []} />
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}