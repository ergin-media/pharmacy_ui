// src/features/dashboard/components/DashboardRevenueComparisonCard.tsx
import type { DashboardRevenueCompareAlignedPointDto } from "../types/dashboard.dto";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import { formatEUR } from "@/shared/lib/format/figures";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";

type Row = {
    day: string;
    current_revenue_total: number;
    prev_revenue_total: number;
};

function formatDayLabel(day: string) {
    return day.padStart(2, "0");
}

export function DashboardRevenueComparisonCard(props: {
    data: DashboardRevenueCompareAlignedPointDto[];
    title?: string;
    subtitle?: string;
    withCard?: boolean;
    withHeader?: boolean;
}) {
    const {
        data,
        title = "Umsatzvergleich",
        subtitle = "Tag-für-Tag Vergleich (Monat vs. Vormonat)",
        withCard = true,
        withHeader = true,
    } = props;

    const rows: Row[] = (data ?? [])
        .map((d) => ({
            day: String(d.day),
            current_revenue_total: d.current?.revenue_total ?? 0,
            prev_revenue_total: d.prev?.revenue_total ?? 0,
        }))
        .sort((a, b) => Number(a.day) - Number(b.day));

    const chartConfig = {
        current_revenue_total: {
            label: "Aktueller Monat",
            color: "var(--chart-1)",
        },
        prev_revenue_total: {
            label: "Vormonat",
            color: "var(--muted-foreground)",
        },
    } as const;

    const content = (
        <>
            {withHeader ? (
                <div className="mb-3">
                    <div className="text-sm font-medium">{title}</div>
                    <div className="text-xs text-muted-foreground">
                        {subtitle}
                    </div>
                </div>
            ) : null}

            <ChartContainer config={chartConfig} className="h-72 w-full">
                <BarChart data={rows} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid vertical={false} />

                    <XAxis
                        dataKey="day"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        minTickGap={8}
                        tickFormatter={formatDayLabel}
                    />

                    <YAxis tickLine={false} axisLine={false} width={72} />

                    <ChartTooltip
                        cursor={false}
                        content={
                            <ChartTooltipContent
                                labelFormatter={(label, payload) => {
                                    const rawDay =
                                        payload?.[0]?.payload?.day ?? label;
                                    return `Tag: ${formatDayLabel(
                                        String(rawDay ?? ""),
                                    )}`;
                                }}
                                formatter={(value, name) => {
                                    const key = String(name);

                                    if (key === "current_revenue_total") {
                                        return [
                                            formatEUR(Number(value)),
                                            "Aktueller Monat",
                                        ];
                                    }

                                    if (key === "prev_revenue_total") {
                                        return [
                                            formatEUR(Number(value)),
                                            "Vormonat",
                                        ];
                                    }

                                    return [String(value), key];
                                }}
                            />
                        }
                    />

                    <ChartLegend content={<ChartLegendContent />} />

                    <Bar
                        dataKey="prev_revenue_total"
                        fill="var(--color-prev_revenue_total)"
                        radius={4}
                        opacity={0.35}
                    />

                    <Bar
                        dataKey="current_revenue_total"
                        fill="var(--color-current_revenue_total)"
                        radius={4}
                    />
                </BarChart>
            </ChartContainer>

            {rows.length > 0 ? (
                <div className="mt-3 text-xs text-muted-foreground">
                    Aktueller Monat vs. Vormonat auf Tagesbasis.
                </div>
            ) : null}
        </>
    );

    if (!withCard) {
        return content;
    }

    return <div className="rounded-lg bg-card p-4">{content}</div>;
}