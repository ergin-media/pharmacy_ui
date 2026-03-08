import type { DashboardPeriod } from "../types/dashboard.dto";
import { formatEUR } from "@/shared/lib/format/figures";
import { BadgeCheck, Clock3, ReceiptText } from "lucide-react";

function getPeriodLabel(period: DashboardPeriod) {
    return period === "rolling_30d" ? "letzte 30 Tage" : "Zeitraum";
}

export function DashboardCashCards(props: {
    period: DashboardPeriod;
    revenuePaid: number;
    revenueUnpaid: number;
    openReceivables: number;
}) {
    const { period, revenuePaid, revenueUnpaid, openReceivables } = props;

    const periodLabel = getPeriodLabel(period);

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-white p-4">
                <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-md bg-muted p-2 text-foreground/80">
                        <BadgeCheck className="size-4" />
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Bezahlt ({periodLabel})
                    </div>
                </div>

                <div className="text-2xl font-semibold">
                    {formatEUR(revenuePaid)}
                </div>

                <div className="mt-2 text-xs text-muted-foreground">
                    Liquidität im ausgewählten Zeitraum
                </div>
            </div>

            <div className="rounded-lg bg-white p-4">
                <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-md bg-muted p-2 text-foreground/80">
                        <Clock3 className="size-4" />
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Unbezahlt ({periodLabel})
                    </div>
                </div>

                <div className="text-2xl font-semibold">
                    {formatEUR(revenueUnpaid)}
                </div>

                <div className="mt-2 text-xs text-muted-foreground">
                    Noch nicht realisierter Umsatz
                </div>
            </div>

            <div className="rounded-lg bg-white p-4">
                <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-md bg-muted p-2 text-foreground/80">
                        <ReceiptText className="size-4" />
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Offene Forderungen
                    </div>
                </div>

                <div className="text-2xl font-semibold">
                    {formatEUR(openReceivables)}
                </div>

                <div className="mt-2 text-xs text-muted-foreground">
                    Gesamter aktuell offener Bestand
                </div>
            </div>
        </div>
    );
}