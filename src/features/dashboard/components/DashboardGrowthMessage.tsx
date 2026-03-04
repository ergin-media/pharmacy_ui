"use client";

import { formatPct } from "@/shared/lib/format/figures";
import { ArrowUp, ArrowDown } from "lucide-react";

export function DashboardGrowthMessage(props: { momPct: number }) {
    const { momPct } = props;
    const positive = momPct >= 0;

    return (
        <div className="rounded-lg p-4 bg-white">
            <div className="flex items-center gap-2 text-sm font-medium">
                {positive ? (
                    <ArrowUp className="size-4 text-green-600" />
                ) : (
                    <ArrowDown className="size-4 text-destructive" />
                )}
                <span>
                    Monat läuft {positive ? "" : "nicht "}
                    <span
                        className={
                            positive ? "text-green-600" : "text-destructive"
                        }
                    >
                        {formatPct(momPct)}
                    </span>{" "}
                    im Vergleich zum Vormonat.
                </span>
            </div>
        </div>
    );
}
