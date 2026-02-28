"use client";

import { ArrowUp, ArrowDown } from "lucide-react";
import { formatPct } from "../lib/dashboard.format";

export function DashboardGrowthMessage(props: { momPct: number }) {
    const { momPct } = props;
    const positive = momPct >= 0;

    return (
        <div className="rounded-xl border p-4 bg-muted/40">
            <div className="flex items-center gap-2 text-sm font-medium">
                {positive ? (
                    <ArrowUp className="size-4 text-green-600" />
                ) : (
                    <ArrowDown className="size-4 text-destructive" />
                )}
                <span>
                    Monat läuft {positive ? "" : "nicht "}
                    <span className={positive ? "text-green-600" : "text-destructive"}>
                        {formatPct(momPct)}
                    </span>{" "}
                    im Vergleich zum Vormonat.
                </span>
            </div>
        </div>
    );
}