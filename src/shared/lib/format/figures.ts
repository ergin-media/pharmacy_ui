// src/features/dashboard/lib/dashboard.format.ts
export function formatPct(v: number) {
    if (!Number.isFinite(v)) return "—";
    const sign = v > 0 ? "+" : "";
    return `${sign}${v.toFixed(1)}%`;
}

export function formatEUR(v: number) {
    if (!Number.isFinite(v)) return "—";
    return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 2,
    }).format(v);
}

export function formatInt(v: number) {
    if (!Number.isFinite(v)) return "—";
    return new Intl.NumberFormat("de-DE").format(v);
}

export function formatDayLabel(date: string) {
    // YYYY-MM-DD -> DD
    return date?.slice(8, 10) ?? "";
}