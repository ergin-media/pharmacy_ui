"use client";

import type { DashboardTimeSeriesPointDto } from "../types/dashboard.dto";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Line } from "recharts";

type Row = {
    date: string; // YYYY-MM-DD
    revenue_total: number;
    rx_count: number;
};

function formatDayTick(isoDate: string) {
    // "2026-02-28" -> "28.02"
    const d = new Date(`${isoDate}T00:00:00`);
    return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
}

export function DashboardRevenueCurrentMonthBarChart(props: {
    data: DashboardTimeSeriesPointDto[];
}) {
    const rows: Row[] = (props.data ?? []).map((d) => ({
        date: d.date,
        revenue_total: d.revenue_total ?? 0,
        rx_count: d.rx_count ?? 0,
    }));

    const chartConfig = {
        revenue_total: { label: "Umsatz", color: "var(--chart-1)" },
        rx_count: { label: "RX", color: "var(--chart-4)" },
    } as const;

    return (
        <div className="rounded-xl border p-4 bg-card">
            <div className="mb-3">
                <div className="text-sm font-medium">Umsatz pro Tag (letzte 30 Tage)</div>
                <div className="text-xs text-muted-foreground">
                    Tagesumsatz mit RX-Volumen
                </div>
            </div>

            <ChartContainer config={chartConfig} className="h-72 w-full">
                <BarChart data={rows} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid vertical={false} />

                    <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={formatDayTick}
                        interval="preserveStartEnd"
                    />

                    {/* Umsatz Achse */}
                    <YAxis
                        yAxisId="revenue"
                        tickLine={false}
                        axisLine={false}
                        width={72}
                    />

                    {/* RX Achse */}
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
                                    const key = String(name);

                                    if (key === "revenue_total") {
                                        return [`${Number(value).toFixed(2)} €`, "Umsatz"];
                                    }
                                    if (key === "rx_count") {
                                        return [String(value), "RX"];
                                    }
                                    return [String(value), key];
                                }}
                            />
                        }
                    />

                    <ChartLegend content={<ChartLegendContent />} />

                    {/* Umsatz Balken */}
                    <Bar
                        yAxisId="revenue"
                        dataKey="revenue_total"
                        fill="var(--color-revenue_total)"
                        radius={6}
                    />

                    {/* RX als Linie */}
                    <Line
                        yAxisId="rx"
                        type="monotone"
                        dataKey="rx_count"
                        stroke="var(--color-rx_count)"
                        strokeWidth={2}
                        dot={false}
                    />
                </BarChart>
            </ChartContainer>
        </div>
    );
}