import type { DashboardOrdersDailyPointDto } from "../types/dashboard.dto";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import { formatInt } from "@/shared/lib/format/figures";
import { formatDateDayMonth } from "@/shared/lib/format/date";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";

type Row = {
    date: string;
    orders_count: number;
};

export function DashboardOrdersDailyBarChart(props: {
    data: DashboardOrdersDailyPointDto[];
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
        orders_count: d.orders_count ?? 0,
    }));

    const chartConfig = {
        orders_count: { label: "Bestellungen", color: "var(--chart-2)" },
    } as const;

    const content = (
        <>
            {withHeader ? (
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
                        tickFormatter={formatDateDayMonth}
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
                                formatter={(value, name) => {
                                    const key = String(name);

                                    if (key === "orders_count") {
                                        return [
                                            formatInt(Number(value)),
                                            " Bestellungen",
                                        ];
                                    }

                                    return [String(value), key];
                                }}
                                labelFormatter={(_, payload) => {
                                    const rawDate = payload?.[0]?.payload?.date;
                                    return rawDate
                                        ? `Datum: ${formatDateDayMonth(String(rawDate))}`
                                        : "Datum: —";
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
        </>
    );

    if (!withCard) {
        return content;
    }

    return <div className="rounded-lg bg-card p-4">{content}</div>;
}