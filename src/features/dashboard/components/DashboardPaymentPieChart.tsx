// src/features/dashboard/components/DashboardPaymentPieChart.tsx
"use client";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import { formatInt } from "@/shared/lib/format/figures";
import { PieChart, Pie, Cell } from "recharts";

type PaymentCounts = { unpaid: number; paid: number };

export function DashboardPaymentPieChart(props: { payment: PaymentCounts }) {
    const { payment } = props;

    const total = payment.paid + payment.unpaid;
    const paidPct = total > 0 ? (payment.paid / total) * 100 : 0;

    const data = [
        { key: "paid", label: "Bezahlt", value: payment.paid },
        { key: "unpaid", label: "Offen", value: payment.unpaid },
    ];

    const chartConfig = {
        paid: {
            label: `Bezahlt (${formatInt(payment.paid)})`,
            color: "#16a34a",
        }, // grün
        unpaid: {
            label: `Offen (${formatInt(payment.unpaid)})`,
            color: "#dc2626",
        }, // rot
    } as const;

    return (
        <div className="rounded-lg bg-white p-4">
            <div className="mb-3">
                <div className="text-sm font-medium">Zahlungsstatus</div>
                <div className="text-xs text-muted-foreground">
                    Bezahlt vs. Offen
                </div>
            </div>

            {/* ✅ Outer wrapper gives a stable size + overlay positioning */}
            <div className="relative h-64 w-full">
                <ChartContainer config={chartConfig} className="h-full w-full">
                    <PieChart>
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    formatter={(value, _name, item) => {
                                        const key = (item?.payload?.key ??
                                            "") as keyof typeof chartConfig;
                                        const label =
                                            chartConfig[key]?.label ??
                                            item?.payload?.label ??
                                            "Wert";
                                        return [String(value), label];
                                    }}
                                />
                            }
                        />

                        {/* ✅ Legend labels should come from config via key */}
                        <ChartLegend
                            content={<ChartLegendContent nameKey="key" />}
                        />

                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="key"
                            innerRadius={55}
                            outerRadius={85}
                            paddingAngle={4}
                        >
                            {data.map((entry) => (
                                <Cell
                                    key={entry.key}
                                    fill={`var(--color-${entry.key})`}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>

                {/* ✅ Center KPI overlay */}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center -top-6">
                    <div className="text-2xl font-bold">
                        {paidPct.toFixed(0)}%
                    </div>
                    <div className="text-xs text-muted-foreground">bezahlt</div>
                </div>
            </div>
        </div>
    );
}
