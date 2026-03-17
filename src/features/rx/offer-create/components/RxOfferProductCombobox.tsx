import { useCallback, useMemo, useState } from "react";

import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox";
import { useDebouncedValue } from "@/shared/lib/hooks/useDebouncedValue";
import type { PharmacyProductDto } from "@/features/pharmacy-products/types/pharmacy-products.dto";
import { usePharmacyProductsForMappingQuery } from "@/features/provider-products/queries/pharmacyProductsForMapping.queries";

export function RxOfferProductCombobox(props: {
    value: string;
    selectedProductId?: number | null;
    selectedProduct?: PharmacyProductDto | null;
    disabled?: boolean;
    onInputChange: (value: string) => void;
    onSelectProduct: (product: PharmacyProductDto) => void;
}) {
    const {
        value,
        selectedProductId,
        selectedProduct,
        disabled = false,
        onInputChange,
        onSelectProduct,
    } = props;

    const [searchValue, setSearchValue] = useState("");
    const debouncedSearchValue = useDebouncedValue(searchValue, 300);

    const productsQuery =
        usePharmacyProductsForMappingQuery(debouncedSearchValue);
    const products = productsQuery.data?.items ?? [];

    const mergedProducts = useMemo(() => {
        if (
            !selectedProduct?.id ||
            products.some((p) => p.id === selectedProduct.id)
        ) {
            return products;
        }

        return [selectedProduct, ...products];
    }, [products, selectedProduct]);

    const items = useMemo(
        () => mergedProducts.map((p) => String(p.id)),
        [mergedProducts],
    );

    const byId = useMemo(() => {
        const map = new Map<string, PharmacyProductDto>();
        for (const p of mergedProducts) {
            map.set(String(p.id), p);
        }
        return map;
    }, [mergedProducts]);

    const currentValue = selectedProductId ? String(selectedProductId) : undefined;

    const itemToStringLabel = useCallback(
        (id: string) => byId.get(id)?.name ?? id,
        [byId],
    );

    const itemToStringValue = useCallback((id: string) => id, []);

    const filter = useCallback(() => true, []);

    const handleValueChange = useCallback(
        (next: string | null) => {
            if (!next) return;

            const product = byId.get(next);
            if (!product) return;

            setSearchValue("");
            onSelectProduct(product);
        },
        [byId, onSelectProduct],
    );

    return (
        <Combobox
            items={items}
            value={currentValue}
            inputValue={value}
            onInputValueChange={(next) => {
                onInputChange(next);
                setSearchValue(next);
            }}
            onValueChange={handleValueChange}
            disabled={disabled}
            itemToStringLabel={itemToStringLabel}
            itemToStringValue={itemToStringValue}
            filter={filter}
        >
            <ComboboxInput
                placeholder="Artikel wählen oder frei eingeben…"
                showClear
                showTrigger
                disabled={disabled}
                loading={productsQuery.isFetching}
            />

            <ComboboxContent side="bottom" align="start">
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
                                                  p.strain ?? "",
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
    );
}