// src/features/dashboard/components/DashboardRiskBarChart.tsx
"use client";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";

export function DashboardRiskBarChart(props: {
    risk: {
        rx_with_unmapped_items: number;
        rx_with_pricing_base_price_missing: number;
        rx_with_patient_issues: number;
        products_missing_base_price: number;
    };
}) {
    const { risk } = props;

    const data = [
        {
            label: "Risiken",
            unmapped: risk.rx_with_unmapped_items,
            pricing: risk.rx_with_pricing_base_price_missing,
            patient: risk.rx_with_patient_issues,
            products: risk.products_missing_base_price,
        },
    ];

    const chartConfig = {
        unmapped: { label: "Unmapped", color: "hsl(var(--chart-1))" },
        pricing: { label: "Pricing Missing", color: "hsl(var(--chart-3))" },
        patient: { label: "Patient Issues", color: "hsl(var(--chart-4))" },
        products: { label: "Products Base Price", color: "hsl(var(--chart-5))" },
    } as const;

    return (
        <div className="rounded-xl border p-4">
            <div className="mb-3">
                <div className="text-sm font-medium">Risk Overview</div>
                <div className="text-xs text-muted-foreground">
                    Qualitäts-/Preis-/Daten-Risiken
                </div>
            </div>

            <ChartContainer config={chartConfig} className="h-56 w-full">
                <BarChart data={data} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickLine={false} axisLine={false} width={40} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />

                    <Bar dataKey="unmapped" stackId="a" fill="var(--color-unmapped)" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="pricing" stackId="a" fill="var(--color-pricing)" />
                    <Bar dataKey="patient" stackId="a" fill="var(--color-patient)" />
                    <Bar dataKey="products" stackId="a" fill="var(--color-products)" radius={[0, 0, 6, 6]} />
                </BarChart>
            </ChartContainer>
        </div>
    );
}