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
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Line,
} from "recharts";

type ChartRow = {
    day: number;
    current_revenue_total: number;
    current_paid: number;
    current_unpaid: number;
    current_rx_count: number;
    prev_revenue_total: number;
};

const chartConfig = {
    current_revenue_total: { label: "Umsatz (aktuell)", color: "var(--chart-1)" },
    current_paid: { label: "Bezahlt", color: "var(--chart-2)" },
    current_unpaid: { label: "Offen", color: "var(--chart-3)" },
    current_rx_count: { label: "RX", color: "var(--chart-4)" },
    prev_revenue_total: { label: "Vormonat", color: "var(--chart-5)" },
} as const;

type ChartKey = keyof typeof chartConfig;

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

    return (
        <div className="rounded-xl border p-4 bg-white">
            <div className="mb-3">
                <div className="text-sm font-medium">Umsatzvergleich (Aligned MoM)</div>
                <div className="text-xs text-muted-foreground">
                    Aktueller Monat vs. gleicher Zeitraum im Vormonat
                </div>
            </div>

            <ChartContainer config={chartConfig} className="h-72 w-full">
                <ComposedChart data={rows} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid vertical={false} />

                    <XAxis
                        dataKey="day"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                    />

                    {/* Revenue axis (links) */}
                    <YAxis
                        yAxisId="revenue"
                        tickLine={false}
                        axisLine={false}
                        width={60}
                    />

                    {/* RX axis (rechts) */}
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
                                labelKey="day"
                                formatter={(value, name) => {
                                    const key = String(name) as ChartKey;

                                    if (key === "current_rx_count") return [String(value), "RX"];

                                    if (key in chartConfig) {
                                        return [`${Number(value).toFixed(2)} €`, chartConfig[key].label];
                                    }

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
                        fillOpacity={0.35}
                    />
                    <Area
                        yAxisId="revenue"
                        type="monotone"
                        dataKey="current_unpaid"
                        stackId="revenue"
                        fill="var(--color-current_unpaid)"
                        stroke="var(--color-current_unpaid)"
                        fillOpacity={0.35}
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

                    {/* ✅ Vormonat Vergleichslinie */}
                    <Line
                        yAxisId="revenue"
                        type="monotone"
                        dataKey="prev_revenue_total"
                        stroke="var(--color-prev_revenue_total)"
                        strokeWidth={2.5}
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
                </ComposedChart>
            </ChartContainer>
        </div>
    );
}