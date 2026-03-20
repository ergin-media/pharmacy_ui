import { useState } from "react";
import type { ProviderProductMapDto } from "../types/provider-products.dto";
import { mapProviderMappingPharmacyProductToDto } from "../lib/provider-products.mappers";
import { PharmacyProductSearchCombobox } from "@/features/pharmacy-products/components/PharmacyProductSearchCombobox";

export function ProviderProductMappingCell(props: {
    row: ProviderProductMapDto;
    isLoading?: boolean;
    onSelect: (pharmacyProductId: number | null) => void;
}) {
    const { row, isLoading = false, onSelect } = props;

    const [searchValue, setSearchValue] = useState("");

    const currentPharmacyProduct = mapProviderMappingPharmacyProductToDto(
        row.pharmacy_product,
    );

    return (
        <PharmacyProductSearchCombobox
            value={searchValue}
            selectedProductId={row.pharmacy_product?.id}
            selectedProduct={currentPharmacyProduct}
            disabled={isLoading}
            isUnmapped={!row.pharmacy_product?.id}
            placeholder="Zuordnung wählen…"
            onInputChange={setSearchValue}
            onSelectProduct={(product) => onSelect(product.id)}
            onClearSelection={() => onSelect(null)}
        />
    );
}
