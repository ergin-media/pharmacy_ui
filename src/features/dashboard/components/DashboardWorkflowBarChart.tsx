// src/features/dashboard/components/DashboardWorkflowBarChart.tsx
"use client";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";

type WorkflowCounts = {
    pending: number;
    processing: number;
    completed: number;
    rejected: number;
};

export function DashboardWorkflowBarChart(props: { workflow: WorkflowCounts }) {
    const { workflow } = props;

    const data = [
        { label: "Pending", value: workflow.pending },
        { label: "Processing", value: workflow.processing },
        { label: "Completed", value: workflow.completed },
        { label: "Rejected", value: workflow.rejected },
    ];

    const chartConfig = {
        value: { label: "Anzahl", color: "hsl(var(--chart-1))" },
    } as const;

    return (
        <div className="rounded-xl border p-4">
            <div className="mb-3">
                <div className="text-sm font-medium">Workflow</div>
                <div className="text-xs text-muted-foreground">Status-Verteilung</div>
            </div>

            <ChartContainer config={chartConfig} className="h-64 w-full">
                <BarChart data={data} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickLine={false} axisLine={false} width={40} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="var(--color-value)" radius={6} />
                </BarChart>
            </ChartContainer>
        </div>
    );
}