import type { DashboardRevenueCompareAlignedDto } from "../types/dashboard.dto";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";

type Row = {
    day: number;
    current_total: number;
    prev_total: number;
};

export function DashboardRevenueMoMGroupedBarChart(props: {
    data: DashboardRevenueCompareAlignedDto[];
}) {
    const rows: Row[] = (props.data ?? []).map((d) => ({
        day: d.day,
        current_total: d.current?.revenue_total ?? 0,
        prev_total: d.prev?.revenue_total ?? 0,
    }));

    const chartConfig = {
        current_total: { label: "Aktueller Monat", color: "var(--chart-1)" },
        prev_total: { label: "Vormonat", color: "var(--chart-5)" },
    } as const;

    return (
        <div className="rounded-xl border p-4 bg-card">
            <div className="mb-3">
                <div className="text-sm font-medium">Umsatz pro Tag (MoM)</div>
                <div className="text-xs text-muted-foreground">
                    Aktueller Monat vs. gleicher Tag im Vormonat (nebeneinander)
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
                                    const key = String(name) as keyof typeof chartConfig;
                                    if (key in chartConfig) {
                                        return [`${Number(value).toFixed(2)} €`, chartConfig[key].label];
                                    }
                                    return [String(value), String(name)];
                                }}
                            />
                        }
                    />

                    <ChartLegend content={<ChartLegendContent />} />

                    {/* ✅ 2 Bars nebeneinander = kein stackId */}
                    <Bar
                        dataKey="prev_total"
                        fill="var(--color-prev_total)"
                        radius={6}
                    />
                    <Bar
                        dataKey="current_total"
                        fill="var(--color-current_total)"
                        radius={6}
                    />
                </BarChart>
            </ChartContainer>
        </div>
    );
}