import type { RxListItemDto } from "../types/rx.dto";

/**
 * Prüft ob ein RX-Item eine gültige Zuordnung hat.
 */
export function rxItemHasMapping(item: {
    mapping?: {
        pharmacy_product_id?: number | null;
        has_pharmacy_product?: boolean | 0 | 1 | null;
    } | null;
}): boolean {
    const v = item?.mapping?.has_pharmacy_product;

    if (v === true || v === 1) return true;
    if (v === false || v === 0) return false;

    return Boolean(item?.mapping?.pharmacy_product_id);
}

/**
 * Liefert den anzuzeigenden Produktnamen.
 */
export function rxItemLabel(item: {
    raw_product_name?: string | null;
    normalized_product_name?: string | null;
}): string {
    return (
        item.raw_product_name ??
        item.normalized_product_name ??
        "—"
    );
}

/**
 * Berechnet Anzahl der nicht gemappten Items.
 * Fallback falls summary.unmapped_items_count nicht gesetzt ist.
 */
export function rxUnmappedCount(rx: RxListItemDto): number {
    if (typeof rx.summary?.unmapped_items_count === "number") {
        return rx.summary.unmapped_items_count;
    }

    const items = rx.items ?? [];
    return items.filter((it) => !rxItemHasMapping(it)).length;
}