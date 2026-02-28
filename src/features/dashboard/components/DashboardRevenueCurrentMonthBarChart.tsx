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
    Line,
} from "recharts";

type Row = {
    day: number;
    revenue_total: number;
    rx_count: number;
};

export function DashboardRevenueCurrentMonthBarChart(props: {
    data: DashboardRevenueCompareAlignedDto[];
}) {
    const rows: Row[] = (props.data ?? []).map((d) => ({
        day: d.day,
        revenue_total: d.current?.revenue_total ?? 0,
        rx_count: d.current?.rx_count ?? 0,
    }));

    const chartConfig = {
        revenue_total: { label: "Umsatz", color: "var(--chart-1)" },
        rx_count: { label: "RX", color: "var(--chart-4)" },
    } as const;

    return (
        <div className="rounded-xl border p-4 bg-card">
            <div className="mb-3">
                <div className="text-sm font-medium">
                    Umsatz pro Tag (aktueller Monat)
                </div>
                <div className="text-xs text-muted-foreground">
                    Tagesumsatz mit RX-Volumen
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
                                labelKey="day"
                                formatter={(value, name) => {
                                    if (name === "revenue_total")
                                        return [`${Number(value).toFixed(2)} €`, "Umsatz"];
                                    if (name === "rx_count")
                                        return [String(value), "RX"];
                                    return [String(value), String(name)];
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

                    {/* RX als Linie oben drüber (optional, sehr clean) */}
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