export function formatPersonName(
    first?: string | null,
    last?: string | null,
    fallback = "Unbekannt",
): string {
    const name = `${first ?? ""} ${last ?? ""}`.trim();
    return name || fallback;
}
