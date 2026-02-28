import type { DashboardTopProductDto } from "../types/dashboard.dto";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
} from "recharts";

export function DashboardTopProductsBarChart(props: {
    products: DashboardTopProductDto[];
}) {
    const { products } = props;

    const data = (products ?? []).slice(0, 8).map((p) => ({
        name: p.name,
        revenue: p.revenue_estimated,
    }));

    const chartConfig = {
        revenue: { label: "Umsatz (est.)", color: "hsl(var(--chart-1))" },
    } as const;

    const hasData = data.length > 0;

    return (
        <div className="rounded-xl border p-4">
            <div className="mb-3">
                <div className="text-sm font-medium">Top Produkte</div>
                <div className="text-xs text-muted-foreground">
                    Umsatz (geschätzt) je Produkt
                </div>
            </div>

            {hasData ? (
                <ChartContainer config={chartConfig} className="h-80 w-full">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ left: 12, right: 12 }}
                    >
                        <CartesianGrid horizontal={false} />
                        <XAxis
                            type="number"
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            type="category"
                            dataKey="name"
                            width={180}
                            tickLine={false}
                            axisLine={false}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                            dataKey="revenue"
                            fill="var(--color-revenue)"
                            radius={6}
                        />
                    </BarChart>
                </ChartContainer>
            ) : (
                <div className="flex h-80 items-center justify-center text-sm text-muted-foreground">
                    Keine Produktdaten verfügbar.
                </div>
            )}
        </div>
    );
}