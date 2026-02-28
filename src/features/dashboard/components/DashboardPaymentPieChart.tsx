import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";

type PaymentCounts = {
    unpaid: number;
    paid: number;
};

export function DashboardPaymentPieChart(props: { payment: PaymentCounts }) {
    const { payment } = props;

    const data = [
        { key: "paid", name: "Bezahlt", value: payment.paid },
        { key: "unpaid", name: "Unbezahlt", value: payment.unpaid },
    ];

    const chartConfig = {
        paid: { label: "Bezahlt", color: "hsl(var(--chart-2))" },
        unpaid: { label: "Unbezahlt", color: "hsl(var(--chart-3))" },
    } as const;

    const total = payment.paid + payment.unpaid;

    return (
        <div className="rounded-xl border p-4">
            <div className="mb-3">
                <div className="text-sm font-medium">Payments</div>
                <div className="text-xs text-muted-foreground">
                    Anteil bezahlt vs. unbezahlt
                </div>
            </div>

            <ChartContainer config={chartConfig} className="h-64 w-full">
                <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                    >
                        {data.map((entry) => (
                            <Cell
                                key={entry.key}
                                fill={`var(--color-${entry.key})`}
                            />
                        ))}
                    </Pie>
                    {/* optional: Center label via CSS/overlay */}
                </PieChart>
            </ChartContainer>

            <div className="mt-3 text-xs text-muted-foreground">
                Gesamt: <span className="text-foreground font-medium">{total}</span>
            </div>
        </div>
    );
}