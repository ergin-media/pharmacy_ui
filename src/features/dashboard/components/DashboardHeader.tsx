// src/features/dashboard/components/DashboardHeader.tsx
import { TypographyH1 } from "@/components/ui/typography";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardPeriod } from "../types/dashboard.dto";

function getPeriodLabel(period: DashboardPeriod) {
    if (period === "rolling_30d") return "Letzte 30 Tage";
    if (period === "mtd") return "Monat bis heute";
    if (period === "prev_month") return "Vormonat";
    return "YTD";
}

export function DashboardHeader(props: {
    title?: string;
    rangeLabel?: string;
    period: DashboardPeriod;
}) {
    const { title = "Dashboard", rangeLabel, period } = props;

    return (
        <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
                <TypographyH1 className="mb-1">{title}</TypographyH1>

                <div className="text-xs text-muted-foreground">
                    Zeitraum:{" "}
                    <span className="font-medium text-foreground">
                        {rangeLabel ?? (
                            <Skeleton className="inline-block h-3 w-24 align-middle" />
                        )}
                    </span>
                </div>
            </div>

            <div className="rounded-full border bg-white px-3 py-1 text-xs text-muted-foreground">
                {getPeriodLabel(period)}
            </div>
        </div>
    );
}