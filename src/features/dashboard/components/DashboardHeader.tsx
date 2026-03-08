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
    loading?: boolean;
}) {
    const { title = "Dashboard", rangeLabel, period, loading = false } = props;

    return (
        <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
                <TypographyH1 className="mb-1">{title}</TypographyH1>

                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span>Zeitraum</span>

                    {loading ? (
                        <Skeleton className="h-4 w-32" />
                    ) : (
                        <span className="font-medium text-foreground">
                            {rangeLabel ?? "—"}
                        </span>
                    )}
                </div>
            </div>

            {loading ? (
                <Skeleton className="h-8 w-28 rounded-full" />
            ) : (
                <div className="inline-flex items-center rounded-full border bg-white px-3 py-1 text-xs font-medium text-muted-foreground">
                    {getPeriodLabel(period)}
                </div>
            )}
        </div>
    );
}