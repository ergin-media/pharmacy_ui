import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { ProviderProductMapDto } from "../types/provider-products.dto";
import type { PharmacyProductDto } from "@/features/pharmacy-products/types/pharmacy-products.dto";

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

    const isUnmapped = !row.pharmacy_product?.id;

    const items = useMemo(() => products.map((p) => String(p.id)), [products]);

    const byId = useMemo(() => {
        const m = new Map<string, PharmacyProductDto>();
        for (const p of products) m.set(String(p.id), p);
        return m;
    }, [products]);

    const currentValue = row.pharmacy_product?.id
        ? String(row.pharmacy_product.id)
        : undefined;

    return (
        <div className="min-w-80">
            <Combobox
                items={items}
                value={currentValue}
                onValueChange={(v: string | null) => {
                    if (!v) {
                        onSelect(null);
                        return;
                    }
                    const id = Number(v);
                    onSelect(Number.isFinite(id) ? id : null);
                }}
                disabled={isLoading}
                itemToStringLabel={(id: string) => {
                    const p = byId.get(id);
                    return p ? p.name : id;
                }}
                itemToStringValue={(id: string) => id}
                filter={(id: string, query: string) => {
                    const q = query.trim().toLowerCase();
                    if (!q) return true;

                    const p = byId.get(id);
                    if (!p) return false;

                    const hay = [
                        p.name,
                        p.product_code,
                        p.manufacturer ?? "",
                        p.name_norm ?? "",
                    ]
                        .join(" ")
                        .toLowerCase();

                    return hay.includes(q);
                }}
            >
                <ComboboxInput
                    placeholder="Zuordnung wählen…"
                    showClear
                    showTrigger
                    disabled={isLoading}
                    loading={isLoading}
                    className={cn(
                        // Basis
                        "transition-colors",
                        // 🔥 Highlight wenn unmapped
                        isUnmapped &&
                            !isLoading &&
                            "border-red-400/70 bg-red-50/40 dark:bg-amber-500/10 focus-visible:ring-red-400",
                    )}
                />

                <ComboboxContent>
                    <ComboboxEmpty>Keine Treffer.</ComboboxEmpty>

                    <ComboboxList>
                        {(id) => {
                            const p = byId.get(id);
                            return (
                                <ComboboxItem key={id} value={id}>
                                    <div className="flex w-full flex-col">
                                        <div className="font-medium">
                                            {p?.name ?? id}
                                        </div>

                                        <div className="text-xs text-muted-foreground">
                                            {p
                                                ? [
                                                      p.product_code
                                                          ? `PZN: ${p.product_code}`
                                                          : "",
                                                      p.manufacturer ?? "",
                                                  ]
                                                      .filter(Boolean)
                                                      .join(" · ")
                                                : "—"}
                                        </div>
                                    </div>
                                </ComboboxItem>
                            );
                        }}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
        </div>
    );
}
