import type { PharmacyProductDto } from "@/features/pharmacy-products/types/pharmacy-products.dto";
import { PharmacyProductSearchCombobox } from "@/features/pharmacy-products/components/PharmacyProductSearchCombobox";

export function RxOfferProductCombobox(props: {
    value: string;
    selectedProductId?: number | null;
    selectedProduct?: PharmacyProductDto | null;
    disabled?: boolean;
    onInputChange: (value: string) => void;
    onSelectProduct: (product: PharmacyProductDto) => void;
}) {
    return (
        <PharmacyProductSearchCombobox
            value={props.value}
            selectedProductId={props.selectedProductId}
            selectedProduct={props.selectedProduct}
            disabled={props.disabled}
            placeholder="Artikel wählen oder frei eingeben…"
            onInputChange={props.onInputChange}
            onSelectProduct={props.onSelectProduct}
        />
    );
}
