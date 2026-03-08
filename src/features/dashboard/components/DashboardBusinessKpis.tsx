// src/features/dashboard/components/DashboardBusinessKpis.tsx
import { Users, Scale } from "lucide-react";
import { formatInt } from "@/shared/lib/format/figures";

function formatGrams(value: number) {
    if (!Number.isFinite(value)) return "—";
    return `${value.toLocaleString("de-DE", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    })} g`;
}

export function DashboardBusinessKpis(props: {
    newPatients30d: number;
    avgGramsPerRxMonth: number;
}) {
    const { newPatients30d, avgGramsPerRxMonth } = props;

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-white p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="text-xs text-muted-foreground">
                        Neue Patienten (30 Tage)
                    </div>
                    <div className="rounded-md bg-muted p-2 text-foreground/80">
                        <Users className="size-4" />
                    </div>
                </div>

                <div className="text-2xl font-semibold">
                    {formatInt(newPatients30d)}
                </div>

                <div className="mt-2 text-xs text-muted-foreground">
                    Neu gewonnene Patienten im letzten 30-Tage-Zeitraum
                </div>
            </div>

            <div className="rounded-lg bg-white p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="text-xs text-muted-foreground">
                        Ø Gramm pro Rezept
                    </div>
                    <div className="rounded-md bg-muted p-2 text-foreground/80">
                        <Scale className="size-4" />
                    </div>
                </div>

                <div className="text-2xl font-semibold">
                    {formatGrams(avgGramsPerRxMonth)}
                </div>

                <div className="mt-2 text-xs text-muted-foreground">
                    Durchschnittliches Volumen je Rezept im gewählten Zeitraum
                </div>
            </div>
        </div>
    );
}