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
        revenue: p.revenue_estimated,
        grams: p.grams_total,
        rx: p.rx_documents_count,
    }));

    const totalRevenue = data.reduce((sum, p) => sum + p.revenue, 0);
    const top5Revenue = data.slice(0, 5).reduce((sum, p) => sum + p.revenue, 0);
    const concentrationPct =
        totalRevenue > 0 ? (top5Revenue / totalRevenue) * 100 : 0;

    const chartConfig = {
        revenue: { label: "Umsatz (est.)", color: "var(--chart-1)" },
    } as const;

    return (
        <div className="rounded-lg bg-white p-4">
            <div className="mb-3">
                <div className="text-sm font-medium">Top Produkte</div>
                <div className="text-xs text-muted-foreground">
                    Umsatz (geschätzt)
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
                                    <div>Umsatz: {formatEUR(item.revenue)}</div>
                                    <div>
                                        Gramm gesamt: {formatInt(item.grams)}
                                    </div>
                                    <div>
                                        RX Dokumente: {formatInt(item.rx)}
                                    </div>
                                </div>
                            );
                        }}
                    />

                    <Bar
                        dataKey="revenue"
                        fill="var(--color-revenue)"
                        radius={6}
                    >
                        <LabelList
                            dataKey="revenue"
                            position="right"
                            formatter={(value: number) =>
                                value > 0 ? formatEUR(value) : ""
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
                des Top-Produkt-Umsatzes.
            </div>
        </div>
    );
}
