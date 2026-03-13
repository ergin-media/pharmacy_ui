export function formatMoney(
    cents?: number | null,
    locale: string = "de-DE",
): string {
    if (cents === null || cents === undefined) return "—";

    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "EUR",
    }).format(cents / 100);
}
