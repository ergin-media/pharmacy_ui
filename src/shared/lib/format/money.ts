export function formatMoney(
    cents?: number | null,
    currency?: string | null,
    locale: string = "de-DE",
): string {
    if (cents === null || cents === undefined) return "—";
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency ?? "EUR",
    }).format(cents / 100);
}
