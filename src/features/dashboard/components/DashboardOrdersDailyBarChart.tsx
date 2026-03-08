import type { DashboardOrdersDailyPointDto } from "../types/dashboard.dto";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";

type Row = {
    date: string;
    orders_count: number;
};

function formatDEDayMonth(isoDate: string) {
    const d = new Date(`${isoDate}T00:00:00`);
    return d.toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
    });
}

export function DashboardOrdersDailyBarChart(props: {
    data: DashboardOrdersDailyPointDto[];
    rangeLabel?: string;
    title?: string;
}) {
    const { data, rangeLabel, title } = props;

    const rows: Row[] = (data ?? []).map((d) => ({
        date: d.date,
        orders_count: d.orders_count ?? 0,
    }));

    const chartConfig = {
        orders_count: { label: "Bestellungen", color: "var(--chart-2)" },
    } as const;

    return (
        <div className="rounded-lg bg-card p-4">
            <div className="mb-3">
                <div className="text-sm font-medium">
                    {title ?? "Bestellungen pro Tag"}
                </div>
                <div className="text-xs text-muted-foreground">
                    {rangeLabel
                        ? `Zeitraum: ${rangeLabel} · Bestellungen pro Tag`
                        : "Bestellungen pro Tag"}
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
                        minTickGap={18}
                        tickFormatter={formatDEDayMonth}
                    />

                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        width={56}
                        allowDecimals={false}
                    />

                    <ChartTooltip
                        cursor={false}
                        content={
                            <ChartTooltipContent
                                labelKey="date"
                                labelFormatter={(label) =>
                                    `Datum: ${formatDEDayMonth(String(label))}`
                                }
                                formatter={(value, name) => {
                                    const key = String(name);

                                    if (key === "orders_count") {
                                        return [String(value), "Bestellungen"];
                                    }

                                    return [String(value), key];
                                }}
                            />
                        }
                    />

                    <ChartLegend content={<ChartLegendContent />} />

                    <Bar
                        dataKey="orders_count"
                        fill="var(--color-orders_count)"
                        radius={6}
                    />
                </BarChart>
            </ChartContainer>
        </div>
    );
}