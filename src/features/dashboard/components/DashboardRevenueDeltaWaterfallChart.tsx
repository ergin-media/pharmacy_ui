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
    ReferenceLine,
    Cell,
} from "recharts";

type Row = {
    day: number;
    delta: number;
    current_total: number;
    prev_total: number;
};

export function DashboardRevenueDeltaWaterfallChart(props: {
    data: DashboardRevenueCompareAlignedDto[];
}) {
    const rows: Row[] = (props.data ?? []).map((d) => {
        const current = d.current.revenue_total ?? 0;
        const prev = d.prev.revenue_total ?? 0;
        return {
            day: d.day,
            delta: current - prev,
            current_total: current,
            prev_total: prev,
        };
    });

    // Hinweis: ChartContainer setzt CSS Variablen wie --color-delta anhand "color".
    // Wir nutzen trotzdem per <Cell /> eine dynamische Farbe (pos/neg).
    const chartConfig = {
        delta: { label: "Δ Umsatz (MoM)", color: "hsl(var(--chart-1))" },
    } as const;

    return (
        <div className="rounded-xl border p-4 bg-card">
            <div className="mb-3">
                <div className="text-sm font-medium">MoM Delta (pro Tag)</div>
                <div className="text-xs text-muted-foreground">
                    Differenz: aktueller Tag − gleicher Tag im Vormonat
                </div>
            </div>

            <ChartContainer config={chartConfig} className="h-72 w-full">
                <BarChart data={rows} margin={{ left: 12, right: 12, top: 8 }}>
                    <CartesianGrid vertical={false} />

                    <XAxis
                        dataKey="day"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                    />

                    <YAxis tickLine={false} axisLine={false} width={72} />

                    <ReferenceLine y={0} stroke="hsl(var(--border))" />

                    <ChartTooltip
                        cursor={false}
                        content={
                            <ChartTooltipContent
                                labelKey="day"
                                formatter={(value, name, item) => {
                                    const row = item?.payload as Row | undefined;

                                    if (String(name) === "delta") {
                                        const delta = Number(value) || 0;
                                        const sign = delta >= 0 ? "+" : "−";
                                        return [
                                            `${sign}${Math.abs(delta).toFixed(2)} €`,
                                            "Δ Umsatz",
                                        ];
                                    }

                                    return [String(value), String(name)];
                                }}
                            />
                        }
                    />

                    {/* Legend nur “Δ Umsatz” (Farben sind dynamisch, Legende bleibt bewusst simpel) */}
                    <ChartLegend content={<ChartLegendContent />} />

                    <Bar dataKey="delta" radius={6}>
                        {rows.map((r) => (
                            <Cell
                                key={r.day}
                                fill={r.delta >= 0 ? "#16a34a" : "#ef4444"}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ChartContainer>

            {/* Optional: kleine Erklärung/Lesbarkeit */}
            <div className="mt-2 flex gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                    <span className="inline-block size-2 rounded-full" style={{ background: "#16a34a" }} />
                    <span>höher als Vormonat</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="inline-block size-2 rounded-full" style={{ background: "#ef4444" }} />
                    <span>niedriger als Vormonat</span>
                </div>
            </div>
        </div>
    );
}