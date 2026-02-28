// src/features/dashboard/components/DashboardKpiGrid.tsx
import { formatEUR, formatInt, formatPct } from "../lib/dashboard.format";

export function DashboardKpiGrid(props: {
    economy: {
        revenue_today: number;
        revenue_month: number;
        revenue_prev_month: number;
        revenue_vs_prev_month_pct: number;
        rx_count_month: number;
        avg_rx_value_month: number;
        revenue_paid_month: number;
        revenue_unpaid_month: number;
        open_receivables: number;
    };
    analytics: {
        avg_grams_per_rx_month: number;
        new_patients_30d: number;
    };
    risk: {
        revenue_risk_total: number;
        rx_with_patient_issues: number;
        rx_with_unmapped_items: number;
        rx_with_pricing_base_price_missing: number;
    };
}) {
    const { economy, analytics, risk } = props;

    return (
        <div className="grid gap-3 md:grid-cols-4">
            <div className="rounded-xl border p-4">
                <div className="text-xs text-muted-foreground">Umsatz Monat</div>
                <div className="text-2xl font-semibold">
                    {formatEUR(economy.revenue_month)}
                </div>
                <div className="text-xs text-muted-foreground">
                    vs. Vormonat {formatPct(economy.revenue_vs_prev_month_pct)}
                </div>
            </div>

            <div className="rounded-xl border p-4">
                <div className="text-xs text-muted-foreground">Umsatz heute</div>
                <div className="text-2xl font-semibold">
                    {formatEUR(economy.revenue_today)}
                </div>
                <div className="text-xs text-muted-foreground">
                    Ø RX Wert {formatEUR(economy.avg_rx_value_month)}
                </div>
            </div>

            <div className="rounded-xl border p-4">
                <div className="text-xs text-muted-foreground">RX (Monat)</div>
                <div className="text-2xl font-semibold">
                    {formatInt(economy.rx_count_month)}
                </div>
                <div className="text-xs text-muted-foreground">
                    Ø Gramm/RX{" "}
                    <span className="text-foreground font-medium">
                        {analytics.avg_grams_per_rx_month.toFixed(1)}
                    </span>
                </div>
            </div>

            <div className="rounded-xl border p-4">
                <div className="text-xs text-muted-foreground">Offene Forderungen</div>
                <div className="text-2xl font-semibold">
                    {formatEUR(economy.open_receivables)}
                </div>
                <div className="text-xs text-muted-foreground">
                    Risk: {formatEUR(risk.revenue_risk_total)}
                </div>
            </div>

            <div className="rounded-xl border p-4 md:col-span-2">
                <div className="text-xs text-muted-foreground">Zahlungen (Monat)</div>
                <div className="mt-1 flex flex-wrap gap-3">
                    <div>
                        <div className="text-sm text-muted-foreground">Bezahlt</div>
                        <div className="text-lg font-semibold">
                            {formatEUR(economy.revenue_paid_month)}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-muted-foreground">Unbezahlt</div>
                        <div className="text-lg font-semibold">
                            {formatEUR(economy.revenue_unpaid_month)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border p-4 md:col-span-2">
                <div className="text-xs text-muted-foreground">Risiko & Qualität</div>
                <div className="mt-1 grid grid-cols-2 gap-3 text-sm">
                    <div>
                        <div className="text-muted-foreground">Patient Issues</div>
                        <div className="font-semibold">{formatInt(risk.rx_with_patient_issues)}</div>
                    </div>
                    <div>
                        <div className="text-muted-foreground">Unmapped Items</div>
                        <div className="font-semibold">{formatInt(risk.rx_with_unmapped_items)}</div>
                    </div>
                    <div>
                        <div className="text-muted-foreground">Pricing Missing</div>
                        <div className="font-semibold">
                            {formatInt(risk.rx_with_pricing_base_price_missing)}
                        </div>
                    </div>
                    <div>
                        <div className="text-muted-foreground">Neue Patienten (30d)</div>
                        <div className="font-semibold">{formatInt(analytics.new_patients_30d)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}