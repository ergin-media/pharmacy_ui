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
    const {
        value,
        selectedProductId,
        selectedProduct,
        disabled,
        onInputChange,
        onSelectProduct,
    } = props;

    return (
        <PharmacyProductSearchCombobox
            inputValue={value}
            selectedProductId={selectedProductId}
            selectedProduct={selectedProduct}
            disabled={disabled}
            placeholder="Artikel wählen oder frei eingeben…"
            onInputValueChange={onInputChange}
            onSelectProduct={onSelectProduct}
        />
    );
}
