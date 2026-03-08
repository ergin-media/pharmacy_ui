import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import { formatEUR } from "@/shared/lib/format/figures";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Line } from "recharts";

export type DashboardRevenueDailyDto = {
    date: string; // "2026-02-28"
    revenue_total: number;
    rx_count: number;
};

type Row = {
    date: string;
    revenue_total: number;
    rx_count: number;
};

function formatDEDayMonth(isoDate: string) {
    const d = new Date(`${isoDate}T00:00:00`);
    return d.toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
    });
}

export function DashboardRevenueDailyBarChart(props: {
    data: DashboardRevenueDailyDto[];
    rangeLabel?: string;
    title?: string;
    withCard?: boolean;
    withHeader?: boolean;
}) {
    const {
        data,
        rangeLabel,
        title,
        withCard = true,
        withHeader = true,
    } = props;

    const rows: Row[] = (data ?? []).map((d) => ({
        date: d.date,
        revenue_total: d.revenue_total ?? 0,
        rx_count: d.rx_count ?? 0,
    }));

    const chartConfig = {
        revenue_total: { label: "Umsatz", color: "var(--chart-1)" },
        rx_count: { label: "Rezepte", color: "var(--chart-4)" },
    } as const;

    const content = (
        <>
            {withHeader ? (
                <div className="mb-3">
                    <div className="text-sm font-medium">
                        {title ?? "Umsatz pro Tag"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {rangeLabel
                            ? `Zeitraum: ${rangeLabel} · Umsatz & Rezepte pro Tag`
                            : "Umsatz & Rezepte pro Tag"}
                    </div>
                </div>
            ) : null}

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
                        yAxisId="revenue"
                        tickLine={false}
                        axisLine={false}
                        width={72}
                    />

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
                                labelFormatter={(label) =>
                                    `Datum: ${formatDEDayMonth(String(label))}`
                                }
                                formatter={(value, name) => {
                                    const key = String(name);

                                    if (key === "revenue_total") {
                                        return [
                                            formatEUR(Number(value)),
                                            " ",
                                            "Umsatz",
                                        ];
                                    }

                                    if (key === "rx_count") {
                                        return [String(value), "Rezepte"];
                                    }

                                    return [String(value), key];
                                }}
                            />
                        }
                    />

                    <ChartLegend content={<ChartLegendContent />} />

                    <Bar
                        yAxisId="revenue"
                        dataKey="revenue_total"
                        fill="var(--color-revenue_total)"
                        radius={6}
                    />

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
        </>
    );

    if (!withCard) {
        return content;
    }

    return <div className="rounded-lg bg-card p-4">{content}</div>;
}