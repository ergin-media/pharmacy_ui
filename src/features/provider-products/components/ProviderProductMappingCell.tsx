import { useState } from "react";

import type { ProviderProductMapDto } from "../types/provider-products.dto";
import { ProviderProductMappingCombobox } from "./ProviderProductMappingCombobox";
import { usePharmacyProductsForMappingQuery } from "../queries/pharmacyProductsForMapping.queries";
import { useDebouncedValue } from "@/shared/lib/hooks/useDebouncedValue";

export function ProviderProductMappingCell(props: {
    row: ProviderProductMapDto;
    isLoading?: boolean;
    onSelect: (pharmacyProductId: number | null) => void;
}) {
    const { row, isLoading = false, onSelect } = props;

    const [searchValue, setSearchValue] = useState("");
    const debouncedSearchValue = useDebouncedValue(searchValue, 250);

    const pharmacyProductsQuery =
        usePharmacyProductsForMappingQuery(debouncedSearchValue);

    const products = pharmacyProductsQuery.data?.items ?? [];

    return (
        <ProviderProductMappingCombobox
            currentPharmacyProductId={row.pharmacy_product?.id ?? null}
            isUnmapped={!row.pharmacy_product?.id}
            products={products}
            searchValue={searchValue}
            onSearchValueChange={setSearchValue}
            isLoading={pharmacyProductsQuery.isFetching}
            isDisabled={isLoading}
            onSelect={onSelect}
        />
    );
}
