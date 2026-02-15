type PriceMeta = {
    isComplete: boolean;
    hint: string | null;
};

type MappingMeta = {
    unmappedCount: number;
    hint: string | null;
};

export function getPriceMeta(
    summary?: {
        price_is_complete?: boolean | null;
        unmapped_items_count?: number | null;
    } | null,
): PriceMeta {
    const isComplete = summary?.price_is_complete !== false;

    if (!isComplete) {
        const unmapped = summary?.unmapped_items_count ?? 0;

        if (unmapped > 0) {
            return {
                isComplete: false,
                hint: `${unmapped} Artikel ohne Zuordnung – Gesamtpreis ggf. unvollständig`,
            };
        }

        return { isComplete: false, hint: "Gesamtpreis ggf. unvollständig" };
    }

    return { isComplete: true, hint: null };
}

export function getMappingMeta(
    summary?: {
        unmapped_items_count?: number | null;
    } | null,
): MappingMeta {
    const unmappedCount = summary?.unmapped_items_count ?? 0;

    if (unmappedCount > 0) {
        return {
            unmappedCount,
            hint:
                unmappedCount === 1
                    ? "1 Artikel ohne Zuordnung"
                    : `${unmappedCount} Artikel ohne Zuordnung`,
        };
    }

    return { unmappedCount: 0, hint: null };
}
