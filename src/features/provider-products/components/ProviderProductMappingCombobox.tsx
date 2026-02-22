import { useMemo } from "react";
import type { ProviderProductMapDto } from "../types/provider-products.dto";

import type { PharmacyProductDto } from "@/features/pharmacy-products/types/pharmacy-products.dto";
import {
    encodePharmacyProduct,
    pharmacyProductLabel,
    decodePharmacyProduct,
} from "../lib/provider-products.mapping";

import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox";

export function ProviderProductMappingCombobox(props: {
    row: ProviderProductMapDto;
    products: PharmacyProductDto[];
    isLoading?: boolean;
    onSelect: (pharmacyProductId: number | null) => void;
}) {
    const { row, products, isLoading = false, onSelect } = props;

    // Combobox items: string[]
    const items = useMemo(() => products.map(encodePharmacyProduct), [products]);

    // Current value: string | undefined
    const currentValue = useMemo(() => {
        const p = row.pharmacy_product;
        if (!p?.id) return undefined;

        return p.name;
    }, [row.pharmacy_product]);

    return (
        <div className="min-w-80">
            <Combobox
                items={items}
                value={currentValue}
                // je nach Combobox-API: onValueChange/onChange – falls bei dir anders heißt, sag kurz
                onValueChange={(v) => {
                    if (!v) {
                        onSelect(null);
                        return;
                    }
                    const d = decodePharmacyProduct(v);
                    onSelect(d?.id ?? null);
                }}
                disabled={isLoading}
                filter={(item, search) => {
                    // Client-side search: Name + PZN + Hersteller (wenn du es encodierst)
                    // Aktuell im label ist Name + Preise => reicht schon für "Name contains"
                    const label = pharmacyProductLabel(item).toLowerCase();
                    return label.includes(search.toLowerCase());
                }}
            >
                <ComboboxInput placeholder="Zuordnung wählen…" />
                <ComboboxContent>
                    <ComboboxEmpty>Keine Treffer.</ComboboxEmpty>
                    <ComboboxList>
                        {(item) => (
                            <ComboboxItem key={item} value={item}>
                                {pharmacyProductLabel(item)}
                            </ComboboxItem>
                        )}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
        </div>
    );
}