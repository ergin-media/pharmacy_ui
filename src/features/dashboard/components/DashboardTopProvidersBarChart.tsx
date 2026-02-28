// src/features/dashboard/components/DashboardTopProvidersBarChart.tsx
"use client";

import type { DashboardTopProviderDto } from "../types/dashboard.dto";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";

export function DashboardTopProvidersBarChart(props: {
    providers: DashboardTopProviderDto[];
}) {
    const data = (props.providers ?? []).slice(0, 8).map((p) => ({
        name: p.name,
        rx: p.rx_documents_count,
    }));

    const chartConfig = {
        rx: { label: "RX", color: "var(--chart-2)" },
    } as const;

    return (
        <div className="rounded-xl border p-4 bg-white">
            <div className="mb-3">
                <div className="text-sm font-medium">Top Provider</div>
                <div className="text-xs text-muted-foreground">RX Volumen</div>
            </div>

            <ChartContainer config={chartConfig} className="h-80 w-full">
                <BarChart data={data} layout="vertical" margin={{ left: 12, right: 12 }}>
                    <CartesianGrid horizontal={false} />
                    <XAxis type="number" tickLine={false} axisLine={false} />
                    <YAxis
                        type="category"
                        dataKey="name"
                        width={140}
                        tickLine={false}
                        axisLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="rx" fill="var(--color-rx)" radius={6} />
                </BarChart>
            </ChartContainer>
        </div>
    );
}