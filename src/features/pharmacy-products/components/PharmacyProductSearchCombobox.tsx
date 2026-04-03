import { useCallback, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox";
import { Badge } from "@/components/ui/badge";

import { useDebouncedValue } from "@/shared/lib/hooks/useDebouncedValue";
import type { PharmacyProductDto } from "../types/pharmacy-products.dto";
import { usePharmacyProductsForComboboxQuery } from "@/features/provider-products/queries/pharmacyProductsForCombobox.queries";
import { usePharmacyProductsForMappingQuery } from "@/features/provider-products/queries/pharmacyProductsForMapping.queries";
import { formatMoney } from "@/shared/lib/format/money";

function normalize(value: string) {
    return value.trim().toLowerCase();
}

function matchesProduct(product: PharmacyProductDto, query: string) {
    const q = normalize(query);
    if (!q) return true;

    const haystack = [
        product.name,
        product.product_code,
        product.manufacturer ?? "",
        product.strain ?? "",
        product.name_norm ?? "",
        product.strain_norm ?? "",
    ]
        .join(" ")
        .toLowerCase();

    return haystack.includes(q);
}

export function PharmacyProductSearchCombobox(props: {
    inputValue: string;
    selectedProductId?: number | null;
    selectedProduct?: PharmacyProductDto | null;
    disabled?: boolean;
    isUnmapped?: boolean;
    placeholder?: string;
    onInputValueChange: (value: string) => void;
    onSelectProduct: (product: PharmacyProductDto) => void;
    onClearSelection?: () => void;
}) {
    const {
        inputValue,
        selectedProductId,
        selectedProduct,
        disabled = false,
        isUnmapped = false,
        placeholder = "Artikel wählen…",
        onInputValueChange,
        onSelectProduct,
        onClearSelection,
    } = props;

    const [searchValue, setSearchValue] = useState("");
    const ignoreNextInputChangeRef = useRef(false);

    const debouncedSearchValue = useDebouncedValue(searchValue, 300);

    const initialProductsQuery = usePharmacyProductsForComboboxQuery();

    const initialProducts = useMemo(
        () => initialProductsQuery.data?.items ?? [],
        [initialProductsQuery.data?.items],
    );

    const localMatches = useMemo(() => {
        return initialProducts.filter((product) =>
            matchesProduct(product, searchValue),
        );
    }, [initialProducts, searchValue]);

    const shouldUseRemoteSearch =
        normalize(searchValue).length >= 2 && localMatches.length === 0;

    const remoteProductsQuery = usePharmacyProductsForMappingQuery(
        shouldUseRemoteSearch ? debouncedSearchValue : "",
    );

    const remoteProducts = useMemo(
        () => remoteProductsQuery.data?.items ?? [],
        [remoteProductsQuery.data?.items],
    );

    const products = useMemo(() => {
        if (!searchValue.trim()) {
            return initialProducts;
        }

        return shouldUseRemoteSearch ? remoteProducts : localMatches;
    }, [
        searchValue,
        initialProducts,
        shouldUseRemoteSearch,
        remoteProducts,
        localMatches,
    ]);

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

    const currentValue = useMemo(() => {
        if (selectedProductId == null) return null;
        return String(selectedProductId);
    }, [selectedProductId]);

    const itemToStringLabel = useCallback(
        (id: string) => byId.get(id)?.name ?? id,
        [byId],
    );

    const itemToStringValue = useCallback((id: string) => id, []);

    const filter = useCallback(() => true, []);

    const handleValueChange = useCallback(
        (next: string | null) => {
            if (next == null) {
                ignoreNextInputChangeRef.current = true;
                setSearchValue("");
                onClearSelection?.();
                return;
            }

            const product = byId.get(next);
            if (!product) return;

            ignoreNextInputChangeRef.current = true;
            setSearchValue("");
            onSelectProduct(product);
        },
        [byId, onSelectProduct, onClearSelection],
    );

    const isLoading =
        initialProductsQuery.isFetching ||
        (shouldUseRemoteSearch && remoteProductsQuery.isFetching);

    return (
        <div className="min-w-80">
            <Combobox
                items={items}
                value={currentValue}
                inputValue={inputValue}
                onInputValueChange={(next) => {
                    if (ignoreNextInputChangeRef.current) {
                        ignoreNextInputChangeRef.current = false;
                        return;
                    }

                    onInputValueChange(next);
                    setSearchValue(next);
                }}
                onValueChange={handleValueChange}
                disabled={disabled}
                itemToStringLabel={itemToStringLabel}
                itemToStringValue={itemToStringValue}
                filter={filter}
            >
                <ComboboxInput
                    placeholder={placeholder}
                    showClear
                    showTrigger
                    disabled={disabled}
                    loading={isLoading}
                    className={cn(
                        "transition-colors",
                        isUnmapped &&
                        !isLoading &&
                        "border-red-400/70 bg-red-50/40 dark:bg-amber-500/10 focus-visible:ring-red-400",
                        selectedProduct &&
                        !selectedProduct.is_active &&
                        "border-amber-400/70 bg-amber-50/50 dark:bg-amber-500/10 focus-visible:ring-amber-400",
                    )}
                />

                <ComboboxContent side="bottom" align="start">
                    <ComboboxEmpty>Keine Treffer.</ComboboxEmpty>

                    <ComboboxList>
                        {(id) => {
                            const p = byId.get(id);

                            return (
                                <ComboboxItem
                                    key={id}
                                    value={id}
                                    className={cn(!p?.is_active && "opacity-60")}
                                >
                                    <div className="flex w-full flex-col gap-1.5">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="font-medium">
                                                {p?.name ?? id}
                                            </div>

                                            {p ? (
                                                p.is_active ? (
                                                    <Badge variant="success">Aktiv</Badge>
                                                ) : (
                                                    <Badge variant="destructive">Inaktiv</Badge>
                                                )
                                            ) : null}
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

                                        {p ? (
                                            <div className="text-xs text-muted-foreground">
                                                {[
                                                    p.prices.base_price_cents != null
                                                        ? `Preis: ${formatMoney(p.prices.base_price_cents)}`
                                                        : "",
                                                    p.prices.price_other_provider_cents != null
                                                        ? `Preis (andere): ${formatMoney(p.prices.price_other_provider_cents)}`
                                                        : "",
                                                ]
                                                    .filter(Boolean)
                                                    .join(" · ")}
                                            </div>
                                        ) : null}
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