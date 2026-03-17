import { useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
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
    currentPharmacyProductId?: number | null;
    isUnmapped?: boolean;
    products: PharmacyProductDto[];
    searchValue: string;
    onSearchValueChange: (value: string) => void;
    isLoading?: boolean;
    isDisabled?: boolean;
    onSelect: (pharmacyProductId: number | null) => void;
}) {
    const {
        currentPharmacyProductId,
        isUnmapped = false,
        products,
        searchValue,
        onSearchValueChange,
        isLoading = false,
        isDisabled = false,
        onSelect,
    } = props;

    const items = useMemo(() => products.map((p) => String(p.id)), [products]);

    const byId = useMemo(() => {
        const m = new Map<string, PharmacyProductDto>();
        for (const p of products) m.set(String(p.id), p);
        return m;
    }, [products]);

    const currentValue = currentPharmacyProductId
        ? String(currentPharmacyProductId)
        : undefined;

    const handleValueChange = useCallback(
        (v: string | null) => {
            if (!v) return onSelect(null);
            const id = Number(v);
            onSelect(Number.isFinite(id) ? id : null);
        },
        [onSelect],
    );

    const itemToStringLabel = useCallback(
        (id: string) => byId.get(id)?.name ?? id,
        [byId],
    );

    const itemToStringValue = useCallback((id: string) => id, []);

    return (
        <div className="min-w-80">
            <Combobox
                items={items}
                value={currentValue}
                inputValue={searchValue}
                onInputValueChange={onSearchValueChange}
                onValueChange={handleValueChange}
                disabled={isLoading || isDisabled}
                itemToStringLabel={itemToStringLabel}
                itemToStringValue={itemToStringValue}
            >
                <ComboboxInput
                    placeholder="Zuordnung wählen…"
                    showClear
                    showTrigger
                    disabled={isLoading || isDisabled}
                    loading={isLoading}
                    className={cn(
                        "transition-colors",
                        isUnmapped &&
                            !isLoading &&
                            "border-red-400/70 bg-red-50/40 dark:bg-amber-500/10 focus-visible:ring-red-400",
                    )}
                />

                <ComboboxContent
                    side="bottom"
                    align="start"
                    collisionAvoidance={{
                        side: "shift",
                        align: "shift",
                        fallbackAxisSide: "none",
                    }}
                >
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
