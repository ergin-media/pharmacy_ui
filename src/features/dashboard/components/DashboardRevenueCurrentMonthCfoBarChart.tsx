// src/features/dashboard/components/DashboardRevenueCurrentMonthCfoBarChart.tsx
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
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Cell,
    ReferenceLine,
} from "recharts";

type Row = {
    day: number;
    revenue_total: number;
};

export function DashboardRevenueCurrentMonthCfoBarChart(props: {
    data: DashboardRevenueCompareAlignedDto[];
}) {
    const rows: Row[] = (props.data ?? []).map((d) => ({
        day: d.day,
        revenue_total: d.current?.revenue_total ?? 0,
    }));

    const avg =
        rows.length > 0
            ? rows.reduce((sum, r) => sum + r.revenue_total, 0) / rows.length
            : 0;

    // Du kannst diese zwei Farben später auch als CSS Vars ablegen
    const aboveAvg = "#16a34a"; // grün
    const belowAvg = "#94a3b8"; // slate

    const chartConfig = {
        revenue_total: { label: "Umsatz", color: "hsl(var(--chart-1))" },
        avg: { label: "Ø Tagesumsatz", color: "#64748b" },
    } as const;

    return (
        <div className="rounded-xl border p-4 bg-card">
            <div className="mb-3">
                <div className="text-sm font-medium">
                    Umsatz pro Tag (aktueller Monat)
                </div>
                <div className="text-xs text-muted-foreground">
                    Balken = Tagesumsatz, Linie = Ø Tagesumsatz
                </div>
            </div>

            <ChartContainer config={chartConfig} className="h-72 w-full">
                <BarChart data={rows} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid vertical={false} />

                    <XAxis
                        dataKey="day"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                    />

                    <YAxis tickLine={false} axisLine={false} width={72} />

                    <ChartTooltip
                        cursor={false}
                        content={
                            <ChartTooltipContent
                                labelKey="day"
                                formatter={(value, name) => {
                                    if (name === "revenue_total") {
                                        const v = Number(value) || 0;
                                        const diff = v - avg;
                                        const sign = diff >= 0 ? "+" : "";
                                        return [
                                            `${v.toFixed(2)} € (${sign}${diff.toFixed(2)} € vs Ø)`,
                                            "Umsatz",
                                        ];
                                    }
                                    return [String(value), String(name)];
                                }}
                            />
                        }
                    />

                    {/* Legend optional – sehr CFO-clean: eher weglassen.
              Wenn du sie willst, lass das drin. */}
                    <ChartLegend content={<ChartLegendContent />} />

                    {/* Ø Linie */}
                    <ReferenceLine
                        y={avg}
                        stroke={chartConfig.avg.color}
                        strokeDasharray="6 6"
                    />

                    <Bar dataKey="revenue_total" radius={6}>
                        {rows.map((r) => (
                            <Cell
                                key={`cell-${r.day}`}
                                fill={r.revenue_total >= avg ? aboveAvg : belowAvg}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ChartContainer>

            {/* Optional: kleines Footer-Label */}
            <div className="mt-3 text-xs text-muted-foreground">
                Ø Tagesumsatz:{" "}
                <span className="font-medium text-foreground">{avg.toFixed(2)} €</span>
            </div>
        </div>
    );
}