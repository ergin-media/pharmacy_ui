// src/features/dashboard/components/DashboardRevenueAreaChart.tsx
"use client";

import type { DashboardTimeSeriesPointDto } from "../types/dashboard.dto";
import { formatDayLabel } from "../lib/dashboard.format";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import {
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Line,
} from "recharts";

export function DashboardRevenueAreaChart(props: {
    data: DashboardTimeSeriesPointDto[];
}) {
    const { data } = props;

    const chartConfig = {
        revenue_total: { label: "Umsatz", color: "hsl(var(--chart-1))" },
        revenue_paid: { label: "Bezahlt", color: "hsl(var(--chart-2))" },
        revenue_unpaid: { label: "Offen", color: "hsl(var(--chart-3))" },
        rx_count: { label: "RX", color: "hsl(var(--chart-4))" },
    } as const;

    return (
        <div className="rounded-xl border p-4">
            <div className="mb-3">
                <div className="text-sm font-medium">Umsatzverlauf (Monat)</div>
                <div className="text-xs text-muted-foreground">
                    Total, bezahlt und offen pro Tag
                </div>
            </div>

            <ChartContainer config={chartConfig} className="h-72 w-full">
                <AreaChart data={data} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid vertical={false} />

                    <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={formatDayLabel}
                    />

                    {/* ✅ Revenue axis (left) */}
                    <YAxis
                        yAxisId="revenue"
                        tickLine={false}
                        axisLine={false}
                        width={52}
                    />

                    {/* ✅ RX axis (right) */}
                    <YAxis
                        yAxisId="rx"
                        orientation="right"
                        tickLine={false}
                        axisLine={false}
                        width={40}
                    />

                    <ChartTooltip
                        cursor={false}
                        content={
                            <ChartTooltipContent
                                labelKey="date"
                                formatter={(value, name) => {
                                    if (name === "revenue_total") return [`${value} €`, "Umsatz"];
                                    if (name === "revenue_paid") return [`${value} €`, "Bezahlt"];
                                    if (name === "revenue_unpaid") return [`${value} €`, "Offen"];
                                    if (name === "rx_count") return [String(value), "RX"];
                                    return [String(value), String(name)];
                                }}
                            />
                        }
                    />

                    <ChartLegend content={<ChartLegendContent />} />

                    {/* ✅ RX Count -> right axis */}
                    <Line
                        yAxisId="rx"
                        type="monotone"
                        dataKey="rx_count"
                        stroke="var(--color-rx_count)"
                        strokeWidth={2}
                        dot={false}
                    />

                    {/* ✅ Revenue -> left axis */}
                    <Area
                        yAxisId="revenue"
                        type="monotone"
                        dataKey="revenue_paid"
                        stackId="revenue"
                        fill="var(--color-revenue_paid)"
                        stroke="var(--color-revenue_paid)"
                        fillOpacity={0.4}
                    />

                    <Area
                        yAxisId="revenue"
                        type="monotone"
                        dataKey="revenue_unpaid"
                        stackId="revenue"
                        fill="var(--color-revenue_unpaid)"
                        stroke="var(--color-revenue_unpaid)"
                        fillOpacity={0.4}
                    />

                    {/* Total nur als Linie */}
                    <Line
                        yAxisId="revenue"
                        type="monotone"
                        dataKey="revenue_total"
                        stroke="var(--color-revenue_total)"
                        strokeWidth={3}
                        dot={false}
                    />
                </AreaChart>
            </ChartContainer>
        </div>
    );
}