import type { PharmacyProductDto } from "@/features/pharmacy-products/types/pharmacy-products.dto";
import { formatMoney } from "@/shared/lib/format/money";

const SEP = "::";

/**
 * Encoded value for Combobox (string):
 * `${id}::${name}::${baseCents}::${otherCents}`
 */
export function encodePharmacyProduct(p: PharmacyProductDto): string {
    return p.name ?? "";
    /*
    const base = p.prices?.base_price_cents ?? 0;
    const other = p.prices?.price_other_provider_cents ?? 0;
    return [String(p.id), p.name ?? "", String(base), String(other)].join(SEP);
    */
}

export function decodePharmacyProduct(value: string): {
    id: number;
    name: string;
    baseCents: number;
    otherCents: number;
} | null {
    const parts = value.split(SEP);
    if (parts.length < 4) return null;

    const id = Number(parts[0]);
    if (!Number.isFinite(id) || id <= 0) return null;

    const name = parts[1] ?? "";
    const baseCents = Number(parts[2] ?? 0) || 0;
    const otherCents = Number(parts[3] ?? 0) || 0;

    return { id, name, baseCents, otherCents };
}

export function pharmacyProductLabel(value: string): string {
    const d = decodePharmacyProduct(value);
    if (!d) return value;

    const base = formatMoney(d.baseCents, "EUR");
    const other = formatMoney(d.otherCents, "EUR");

    return `${d.name} · Basis ${base} · Andere ${other}`;
}