import type { DashboardTopProviderDto } from "../types/dashboard.dto";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { formatInt } from "@/shared/lib/format/figures";
import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    LabelList,
} from "recharts";

export function DashboardTopProvidersBarChart(props: {
    providers: DashboardTopProviderDto[];
}) {
    const data = (props.providers ?? []).slice(0, 8).map((p) => ({
        name: p.name,
        recipes: p.rx_documents_count ?? 0,
    }));

    const chartConfig = {
        recipes: { label: "Rezepte", color: "var(--chart-2)" },
    } as const;

    return (
        <div className="rounded-lg bg-white p-4">
            <div className="mb-3">
                <div className="text-sm font-medium">Top Provider</div>
                <div className="text-xs text-muted-foreground">
                    Rezeptvolumen
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
                        width={140}
                        tickLine={false}
                        axisLine={false}
                    />

                    <ChartTooltip
                        content={
                            <ChartTooltipContent
                                formatter={(value, name) => {
                                    if (name === "recipes") {
                                        return [
                                            formatInt(Number(value)),
                                            " Rezepte",
                                        ];
                                    }

                                    return [String(value), String(name)];
                                }}
                            />
                        }
                    />

                    <Bar
                        dataKey="recipes"
                        fill="var(--color-recipes)"
                        radius={6}
                    >
                        <LabelList
                            dataKey="recipes"
                            position="right"
                            formatter={(value: number) =>
                                value > 0 ? formatInt(value) : ""
                            }
                            className="fill-foreground text-xs"
                        />
                    </Bar>
                </BarChart>
            </ChartContainer>
        </div>
    );
}
