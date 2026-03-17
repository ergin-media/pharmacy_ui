import { useState } from "react";

import { useDebouncedValue } from "@/shared/lib/hooks/useDebouncedValue";

import type { ProviderProductMapDto } from "../types/provider-products.dto";
import { usePharmacyProductsForMappingQuery } from "../queries/pharmacyProductsForMapping.queries";
import { mapProviderMappingPharmacyProductToDto } from "../lib/provider-products.mappers";
import { ProviderProductMappingCombobox } from "./ProviderProductMappingCombobox";

export function ProviderProductMappingCell(props: {
    row: ProviderProductMapDto;
    isLoading?: boolean;
    onSelect: (pharmacyProductId: number | null) => void;
}) {
    const { row, isLoading = false, onSelect } = props;

    const [searchValue, setSearchValue] = useState("");
    const debouncedSearchValue = useDebouncedValue(searchValue, 350);

    const pharmacyProductsQuery =
        usePharmacyProductsForMappingQuery(debouncedSearchValue);

    const products = pharmacyProductsQuery.data?.items ?? [];
    const currentPharmacyProduct = mapProviderMappingPharmacyProductToDto(
        row.pharmacy_product,
    );

    return (
        <ProviderProductMappingCombobox
            currentPharmacyProductId={row.pharmacy_product?.id}
            currentPharmacyProduct={currentPharmacyProduct}
            products={products}
            searchValue={searchValue}
            onSearchValueChange={setSearchValue}
            isLoading={pharmacyProductsQuery.isFetching}
            isDisabled={isLoading}
            onSelect={onSelect}
        />
    );
}