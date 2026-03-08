import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Line } from "recharts";
import type { DashboardRevenueDailyDto } from "../types/dashboard.dto";
import { formatDateDayMonth } from "@/shared/lib/format/date";

type Row = {
    date: string;
    revenue_total: number;
    rx_count: number;
};

export function DashboardRevenueCurrentMonthBarChart(props: {
    data: DashboardRevenueDailyDto[];
    rangeLabel?: string; // ✅ optional: "31.01 – 01.03"
    title?: string; // ✅ optional override
}) {
    const { data, rangeLabel, title } = props;

    const rows: Row[] = (data ?? []).map((d) => ({
        date: d.date,
        revenue_total: d.revenue_total ?? 0,
        rx_count: d.rx_count ?? 0,
    }));

    const chartConfig = {
        revenue_total: { label: "Umsatz", color: "var(--chart-1)" },
        rx_count: { label: "RX", color: "var(--chart-4)" },
    } as const;

    return (
        <div className="rounded-xl border bg-card p-4">
            <div className="mb-3">
                <div className="text-sm font-medium">
                    {title ?? "Umsatz pro Tag (letzte 30 Tage)"}
                </div>
                <div className="text-xs text-muted-foreground">
                    {rangeLabel ? `Zeitraum: ${rangeLabel}` : "Tagesumsatz mit RX-Volumen"}
                </div>
            </div>

            <ChartContainer config={chartConfig} className="h-72 w-full">
                <BarChart data={rows} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid vertical={false} />

                    <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={6}
                        minTickGap={8}
                        tickFormatter={formatDateDayMonth}
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
                                labelFormatter={(label) => `Datum: ${formatDateDayMonth(String(label))}`}
                                formatter={(value, name) => {
                                    const key = String(name);

                                    if (key === "revenue_total") {
                                        return [`${Number(value).toFixed(2)} €`, " Umsatz"];
                                    }
                                    if (key === "rx_count") {
                                        return [String(value), " Rezepte"];
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

                    {/* RX Linie */}
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