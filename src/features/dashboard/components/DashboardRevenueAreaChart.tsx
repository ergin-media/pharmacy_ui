// src/features/dashboard/components/DashboardRevenueAreaChart.tsx
"use client";

import type { DashboardRevenueCompareAlignedDto } from "../types/dashboard.dto";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Line } from "recharts";

type ChartRow = {
    day: number;
    current_revenue_total: number;
    current_paid: number;
    current_unpaid: number;
    current_rx_count: number;
    prev_revenue_total: number;
};

export function DashboardRevenueAreaChart(props: {
    data: DashboardRevenueCompareAlignedDto[];
}) {
    const { data } = props;

    const rows: ChartRow[] = (data ?? []).map((d) => ({
        day: d.day,
        current_revenue_total: d.current.revenue_total,
        current_paid: d.current.revenue_paid,
        current_unpaid: d.current.revenue_unpaid,
        current_rx_count: d.current.rx_count,
        prev_revenue_total: d.prev.revenue_total,
    }));

    const chartConfig = {
        current_revenue_total: { label: "Umsatz (aktuell)", color: "hsl(var(--chart-1))" },
        current_paid: { label: "Bezahlt", color: "hsl(var(--chart-2))" },
        current_unpaid: { label: "Offen", color: "hsl(var(--chart-3))" },
        current_rx_count: { label: "RX", color: "hsl(var(--chart-4))" },
        prev_revenue_total: { label: "Vormonat", color: "hsl(var(--chart-5))" },
    } as const;

    return (
        <div className="rounded-xl border p-4">
            <div className="mb-3">
                <div className="text-sm font-medium">Umsatzvergleich (Aligned MoM)</div>
                <div className="text-xs text-muted-foreground">
                    Aktueller Monat vs. gleicher Zeitraum im Vormonat
                </div>
            </div>

            <ChartContainer config={chartConfig} className="h-72 w-full">
                <AreaChart data={rows} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid vertical={false} />

                    <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />

                    <YAxis yAxisId="revenue" tickLine={false} axisLine={false} width={60} />
                    <YAxis yAxisId="rx" orientation="right" tickLine={false} axisLine={false} width={40} />

                    <ChartTooltip
                        cursor={false}
                        content={
                            <ChartTooltipContent
                                labelKey="day"
                                formatter={(value, name) => {
                                    const key = String(name) as keyof typeof chartConfig;

                                    if (key === "current_rx_count") return [String(value), "RX"];

                                    if (key in chartConfig) return [`${value} €`, chartConfig[key].label];

                                    return [String(value), String(name)];
                                }}
                            />
                        }
                    />

                    <ChartLegend content={<ChartLegendContent />} />

                    {/* Paid + Unpaid gestapelt */}
                    <Area
                        yAxisId="revenue"
                        type="monotone"
                        dataKey="current_paid"
                        stackId="revenue"
                        fill="var(--color-current_paid)"
                        stroke="var(--color-current_paid)"
                        fillOpacity={0.4}
                    />
                    <Area
                        yAxisId="revenue"
                        type="monotone"
                        dataKey="current_unpaid"
                        stackId="revenue"
                        fill="var(--color-current_unpaid)"
                        stroke="var(--color-current_unpaid)"
                        fillOpacity={0.4}
                    />

                    {/* Aktueller Gesamtumsatz */}
                    <Line
                        yAxisId="revenue"
                        type="monotone"
                        dataKey="current_revenue_total"
                        stroke="var(--color-current_revenue_total)"
                        strokeWidth={3}
                        dot={false}
                    />

                    {/* Vormonat Vergleichslinie */}
                    <Line
                        yAxisId="revenue"
                        type="monotone"
                        dataKey="prev_revenue_total"
                        stroke="var(--color-prev_revenue_total)"
                        strokeWidth={2}
                        strokeDasharray="6 6"
                        dot={false}
                    />

                    {/* RX Count */}
                    <Line
                        yAxisId="rx"
                        type="monotone"
                        dataKey="current_rx_count"
                        stroke="var(--color-current_rx_count)"
                        strokeWidth={2}
                        dot={false}
                    />
                </AreaChart>
            </ChartContainer>
        </div>
    );
}