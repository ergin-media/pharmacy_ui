export function formatQuantity(
    quantity?: number | null,
    unit?: string | null,
): string {
    if (quantity === null || quantity === undefined) return "—";
    return unit ? `${quantity} ${unit}` : String(quantity);
}
