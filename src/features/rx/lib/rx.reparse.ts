import type { RxListItemDto, RxItem } from "../types/rx.dto";

/** Mapping-Check auf RxItem */
export function rxItemHasMapping(it: RxItem): boolean {
    const v = it.mapping?.has_pharmacy_product;
    if (typeof v === "boolean") return v;
    if (typeof v === "number") return v === 1;
    return Boolean(it.mapping?.pharmacy_product_id);
}

/** Unmapped count: bevorzugt summary, fallback aus items[] */
export function rxUnmappedCount(r: RxListItemDto): number {
    if (typeof r.summary?.unmapped_items_count === "number") {
        return r.summary.unmapped_items_count;
    }

    const its = r.items ?? [];
    return its.filter((it) => !rxItemHasMapping(it)).length;
}

/** pricing_base_price_missing ist relevant auch wenn summary.price_is_complete = true */
export function rxHasPricingBasePriceMissing(r: RxListItemDto): boolean {
    if (r.parse?.flags?.pricing_base_price_missing === true) return true;

    return (r.parse?.warnings ?? []).some(
        (w) => w.code === "pricing_base_price_missing",
    );
}

/** needsAttention = unmapped OR price incomplete OR base_price_missing */
export function rxNeedsAttention(
    r: RxListItemDto,
    unmappedCount: number,
): boolean {
    return (
        unmappedCount > 0 ||
        r.summary?.price_is_complete === false ||
        rxHasPricingBasePriceMissing(r)
    );
}

export function rxCanReparse(r: RxListItemDto): boolean {
    return r.parse?.actions?.can_reparse === true;
}

export function rxShouldShowReparse(
    r: RxListItemDto,
    unmappedCount: number,
): boolean {
    return rxCanReparse(r) && rxNeedsAttention(r, unmappedCount);
}

/** Optional UI helper: soll Preis-Badge angezeigt werden? */
export function rxShouldShowPriceUpdateHint(
    r: RxListItemDto,
    unmappedCount: number,
): boolean {
    // gleiche Logik wie needsAttention – Preisbadge ist Teil davon
    return rxNeedsAttention(r, unmappedCount);
}