"use client";

import type { DashboardTopProductDto } from "../types/dashboard.dto";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { formatEUR, formatInt } from "@/shared/lib/format/figures";
import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    LabelList,
} from "recharts";

export function DashboardTopProductsBarChart(props: {
    products: DashboardTopProductDto[];
}) {
    const data = (props.products ?? []).slice(0, 8).map((p) => ({
        name: p.name,
        grams: p.grams_total ?? 0,
        revenue: p.revenue_estimated ?? 0,
        recipes: p.rx_documents_count ?? 0,
    }));

    const totalGrams = data.reduce((sum, p) => sum + p.grams, 0);
    const top5Grams = data.slice(0, 5).reduce((sum, p) => sum + p.grams, 0);
    const concentrationPct =
        totalGrams > 0 ? (top5Grams / totalGrams) * 100 : 0;

    const chartConfig = {
        grams: { label: "Gramm", color: "var(--chart-1)" },
    } as const;

    return (
        <div className="rounded-lg bg-white p-4">
            <div className="mb-3">
                <div className="text-sm font-medium">Top Produkte</div>
                <div className="text-xs text-muted-foreground">
                    Absatz nach Gramm
                </div>
            </div>

            <ChartContainer config={chartConfig} className="h-80 w-full">
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ left: 12, right: 48 }}
                >
                    <CartesianGrid horizontal={false} />

                    <XAxis type="number" tickLine={false} axisLine={false} />

                    <YAxis
                        type="category"
                        dataKey="name"
                        width={180}
                        tickLine={false}
                        axisLine={false}
                    />

                    <ChartTooltip
                        content={({ active, payload }) => {
                            if (!active || !payload?.length) return null;

                            const item = payload[0].payload;

                            return (
                                <div className="flex flex-col gap-1.5 rounded-md border bg-background p-3 text-xs shadow-md">
                                    <div className="font-medium">
                                        {item.name}
                                    </div>
                                    <div>
                                        Gramm gesamt: {formatInt(item.grams)}
                                    </div>
                                    <div>Umsatz: {formatEUR(item.revenue)}</div>
                                    <div>
                                        Rezepte: {formatInt(item.recipes)}
                                    </div>
                                </div>
                            );
                        }}
                    />

                    <Bar dataKey="grams" fill="var(--color-grams)" radius={6}>
                        <LabelList
                            dataKey="grams"
                            position="right"
                            formatter={(value: number) =>
                                value > 0 ? `${formatInt(value)} g` : ""
                            }
                            className="fill-foreground text-xs"
                        />
                    </Bar>
                </BarChart>
            </ChartContainer>

            <div className="mt-3 text-xs text-muted-foreground">
                Top 5 Produkte generieren{" "}
                <span className="font-medium text-foreground">
                    {concentrationPct.toFixed(1)}%
                </span>{" "}
                des Gesamt-Absatzes (Gramm).
            </div>
        </div>
    );
}
