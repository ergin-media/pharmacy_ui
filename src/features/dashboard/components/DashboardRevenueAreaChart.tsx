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
import { AreaChart, Area, CartesianGrid, XAxis, YAxis } from "recharts";

export function DashboardRevenueAreaChart(props: {
    data: DashboardTimeSeriesPointDto[];
}) {
    const { data } = props;

    const chartConfig = {
        revenue_total: { label: "Umsatz", color: "hsl(var(--chart-1))" },
        revenue_paid: { label: "Bezahlt", color: "hsl(var(--chart-2))" },
        revenue_unpaid: { label: "Offen", color: "hsl(var(--chart-3))" },
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
                    <YAxis tickLine={false} axisLine={false} width={48} />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent labelKey="date" />}
                    />
                    <ChartLegend content={<ChartLegendContent />} />

                    <Area
                        type="monotone"
                        dataKey="revenue_total"
                        fill="var(--color-revenue_total)"
                        stroke="var(--color-revenue_total)"
                        fillOpacity={0.25}
                    />
                    <Area
                        type="monotone"
                        dataKey="revenue_paid"
                        fill="var(--color-revenue_paid)"
                        stroke="var(--color-revenue_paid)"
                        fillOpacity={0.25}
                    />
                    <Area
                        type="monotone"
                        dataKey="revenue_unpaid"
                        fill="var(--color-revenue_unpaid)"
                        stroke="var(--color-revenue_unpaid)"
                        fillOpacity={0.25}
                    />
                </AreaChart>
            </ChartContainer>
        </div>
    );
}