// src/features/dashboard/components/DashboardRevenueHero.tsx
"use client";

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
        <div className="rounded-2xl border p-6 bg-white">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <div className="text-sm text-muted-foreground">
                        Umsatz Monat
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

                    <div className="text-xs text-muted-foreground mt-1">
                        Vormonat: {formatEUR(revenuePrevMonth)}
                    </div>
                </div>

                <div className="flex flex-wrap gap-8 text-sm">
                    <div>
                        <div className="text-muted-foreground">Umsatz heute</div>
                        <div className="font-semibold text-lg">
                            {formatEUR(revenueToday)}
                        </div>
                    </div>

                    <div>
                        <div className="text-muted-foreground">RX Monat</div>
                        <div className="font-semibold text-lg">{rxCountMonth}</div>
                    </div>

                    <div>
                        <div className="text-muted-foreground">Ø RX Wert</div>
                        <div className="font-semibold text-lg">
                            {formatEUR(avgRxValue)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}