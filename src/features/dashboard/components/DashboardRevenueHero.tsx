import { ArrowUp, ArrowDown } from "lucide-react";
import { formatEUR, formatPct } from "../lib/dashboard.format";

export function DashboardRevenueHero(props: {
    revenueMonth: number;
    revenuePrevMonth: number;
    revenueToday: number;
    rxCountMonth: number;
    avgRxValue: number;
    momPct: number;
}) {
    const {
        revenueMonth,
        revenuePrevMonth,
        revenueToday,
        rxCountMonth,
        avgRxValue,
        momPct,
    } = props;

    const isPositive = momPct >= 0;

    return (
        <div className="rounded-2xl border bg-white p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                {/* Haupt KPI */}
                <div>
                    <div className="text-sm text-muted-foreground">
                        Umsatz (letzte 30 Tage)
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-4xl font-bold tracking-tight">
                            {formatEUR(revenueMonth)}
                        </div>

                        <div
                            className={`flex items-center gap-1 text-sm font-medium ${isPositive ? "text-green-600" : "text-destructive"
                                }`}
                        >
                            {isPositive ? (
                                <ArrowUp className="size-4" />
                            ) : (
                                <ArrowDown className="size-4" />
                            )}
                            {formatPct(momPct)}
                        </div>
                    </div>

                    <div className="mt-1 text-xs text-muted-foreground">
                        Vergleich Vormonat: {formatEUR(revenuePrevMonth)}
                    </div>
                </div>

                {/* Secondary KPIs */}
                <div className="flex flex-wrap gap-8 text-sm">
                    <div>
                        <div className="text-muted-foreground">Umsatz heute</div>
                        <div className="text-lg font-semibold">
                            {formatEUR(revenueToday)}
                        </div>
                    </div>

                    <div>
                        <div className="text-muted-foreground">
                            Rezepte (letzte 30 Tage)
                        </div>
                        <div className="text-lg font-semibold">{rxCountMonth}</div>
                    </div>

                    <div>
                        <div className="text-muted-foreground">
                            Ø Umsatz pro Rezept
                        </div>
                        <div className="text-lg font-semibold">
                            {formatEUR(avgRxValue)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}