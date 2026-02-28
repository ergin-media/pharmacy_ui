import type { DashboardRevenueCompareAlignedDto } from "../types/dashboard.dto";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import {
    ComposedChart,
    Bar,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
} from "recharts";

type Row = {
    day: number;
    current_paid: number;
    current_unpaid: number;
    current_revenue_total: number;
};

export function DashboardRevenueShareStackedChart(props: {
    data: DashboardRevenueCompareAlignedDto[];
}) {
    const rows: Row[] = (props.data ?? []).map((d) => ({
        day: d.day,
        current_paid: d.current.revenue_paid,
        current_unpaid: d.current.revenue_unpaid,
        current_revenue_total: d.current.revenue_total,
    }));

    const chartConfig = {
        current_paid: { label: "Bezahlt (Anteil)", color: "#16a34a" },
        current_unpaid: { label: "Offen (Anteil)", color: "#f59e0b" },
        current_revenue_total: { label: "Umsatz (Total)", color: "#2563eb" },
    } as const;

    function pct(n: number) {
        return `${Math.round(n * 100)}%`;
    }

    return (
        <div className="rounded-xl border p-4 bg-card">
            <div className="mb-3">
                <div className="text-sm font-medium">Paid/Unpaid Anteil + Umsatz</div>
                <div className="text-xs text-muted-foreground">
                    100% Anteil (Bars) + Total Umsatz als Linie
                </div>
            </div>

            <ChartContainer config={chartConfig} className="h-72 w-full">
                <ComposedChart
                    data={rows}
                    margin={{ left: 12, right: 12, top: 8 }}
                    stackOffset="expand" // ✅ macht den Stack zu 100%
                >
                    <CartesianGrid vertical={false} />

                    <XAxis
                        dataKey="day"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                    />

                    {/* ✅ Prozent-Achse (0..1) */}
                    <YAxis
                        yAxisId="pct"
                        tickLine={false}
                        axisLine={false}
                        width={44}
                        tickFormatter={(v) => pct(Number(v))}
                        domain={[0, 1]}
                    />

                    {/* ✅ Umsatz-Achse (rechts, absolut) */}
                    <YAxis
                        yAxisId="rev"
                        orientation="right"
                        tickLine={false}
                        axisLine={false}
                        width={70}
                    />

                    <ChartTooltip
                        cursor={false}
                        content={
                            <ChartTooltipContent
                                labelKey="day"
                                formatter={(value, name, item) => {
                                    const key = String(name) as keyof typeof chartConfig;
                                    const row = item?.payload as Row | undefined;

                                    // Bars liefern bei stackOffset="expand" i.d.R. Prozentwerte (0..1).
                                    // Wir zeigen im Tooltip aber lieber:
                                    // - Prozentanteil
                                    // - sowie den absoluten €-Wert aus row.*
                                    if (key === "current_paid" || key === "current_unpaid") {
                                        const paid = row?.current_paid ?? 0;
                                        const unpaid = row?.current_unpaid ?? 0;
                                        const total = paid + unpaid;

                                        const abs = key === "current_paid" ? paid : unpaid;
                                        const share = total > 0 ? abs / total : 0;

                                        return [
                                            `${pct(share)} • ${abs.toFixed(2)} €`,
                                            chartConfig[key].label,
                                        ];
                                    }

                                    if (key === "current_revenue_total") {
                                        const n = Number(value);
                                        return [`${n.toFixed(2)} €`, chartConfig[key].label];
                                    }

                                    return [String(value), String(name)];
                                }}
                            />
                        }
                    />

                    <ChartLegend content={<ChartLegendContent />} />

                    {/* ✅ 100% Stack: Paid/Unpaid */}
                    <Bar
                        yAxisId="pct"
                        dataKey="current_paid"
                        stackId="share"
                        fill="var(--color-current_paid)"
                        radius={[6, 6, 0, 0]}
                    />
                    <Bar
                        yAxisId="pct"
                        dataKey="current_unpaid"
                        stackId="share"
                        fill="var(--color-current_unpaid)"
                        radius={[0, 0, 6, 6]}
                    />

                    {/* ✅ Total Umsatz Linie (absolute Achse rechts) */}
                    <Line
                        yAxisId="rev"
                        type="monotone"
                        dataKey="current_revenue_total"
                        stroke="var(--color-current_revenue_total)"
                        strokeWidth={3}
                        dot={false}
                    />
                </ComposedChart>
            </ChartContainer>
        </div>
    );
}