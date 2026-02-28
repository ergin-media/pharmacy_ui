"use client";

import type { DashboardRevenueCompareAlignedDto } from "../types/dashboard.dto";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    BarChart,
    Bar,
} from "recharts";

type RevenueRow = {
    day: number;
    current_revenue_total: number;
    prev_revenue_total: number;
};

type RxRow = {
    day: number;
    current_rx_count: number;
};

export function DashboardRevenueAreaChart(props: {
    data: DashboardRevenueCompareAlignedDto[];
}) {
    const { data } = props;

    const revenueRows: RevenueRow[] = (data ?? []).map((d) => ({
        day: d.day,
        current_revenue_total: d.current.revenue_total,
        prev_revenue_total: d.prev.revenue_total,
    }));

    const rxRows: RxRow[] = (data ?? []).map((d) => ({
        day: d.day,
        current_rx_count: d.current.rx_count,
    }));

    // ⚠️ Wichtig: ChartContainer setzt pro key CSS-Variable --color-<key>
    // Daher müssen die keys hier exakt den dataKeys entsprechen.
    const revenueChartConfig = {
        current_revenue_total: { label: "Umsatz (aktuell)", color: "var(--chart-1)" },
        prev_revenue_total: { label: "Vormonat", color: "var(--chart-5)" },
    } as const;

    const rxChartConfig = {
        current_rx_count: { label: "RX", color: "var(--chart-4)" },
    } as const;

    return (
        <div className="rounded-xl border p-4 bg-card">
            <div className="mb-3">
                <div className="text-sm font-medium">Umsatzvergleich (MoM)</div>
                <div className="text-xs text-muted-foreground">
                    Aktueller Monat vs. gleicher Zeitraum im Vormonat
                </div>
            </div>

            {/* ✅ Chart 1: Revenue MoM (clean lines) */}
            <ChartContainer config={revenueChartConfig} className="h-56 w-full">
                <LineChart data={revenueRows} margin={{ left: 12, right: 12, top: 8 }}>
                    <CartesianGrid vertical={false} />

                    <XAxis
                        dataKey="day"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                    />

                    <YAxis tickLine={false} axisLine={false} width={60} />

                    <ChartTooltip
                        cursor={false}
                        content={
                            <ChartTooltipContent
                                labelKey="day"
                                formatter={(value, name) => {
                                    const key = String(name) as keyof typeof revenueChartConfig;
                                    if (key in revenueChartConfig) {
                                        return [`${Number(value).toFixed(2)} €`, revenueChartConfig[key].label];
                                    }
                                    return [`${String(value)}`, String(name)];
                                }}
                            />
                        }
                    />

                    <ChartLegend content={<ChartLegendContent />} />

                    <Line
                        type="monotone"
                        dataKey="current_revenue_total"
                        stroke="var(--color-current_revenue_total)"
                        strokeWidth={3}
                        dot={false}
                    />

                    <Line
                        type="monotone"
                        dataKey="prev_revenue_total"
                        stroke="var(--color-prev_revenue_total)"
                        strokeWidth={2}
                        strokeDasharray="6 6"
                        dot={false}
                    />
                </LineChart>
            </ChartContainer>

            {/* ✅ Chart 2: RX mini chart (separat, kein Overlap) */}
            <div className="mt-4">
                <div className="mb-2 flex items-baseline justify-between">
                    <div className="text-xs font-medium">RX pro Tag</div>
                    <div className="text-xs text-muted-foreground">
                        Aktivität (ohne Umsatz-Überlagerung)
                    </div>
                </div>

                <ChartContainer config={rxChartConfig} className="h-28 w-full">
                    <BarChart data={rxRows} margin={{ left: 12, right: 12 }}>
                        <CartesianGrid vertical={false} />

                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />

                        <YAxis tickLine={false} axisLine={false} width={40} />

                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelKey="day"
                                    formatter={(value) => [String(value), "RX"]}
                                />
                            }
                        />

                        <Bar
                            dataKey="current_rx_count"
                            fill="var(--color-current_rx_count)"
                            radius={6}
                        />
                    </BarChart>
                </ChartContainer>
            </div>
        </div>
    );
}