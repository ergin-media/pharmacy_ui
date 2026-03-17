import type { PharmacyProductDto } from "@/features/pharmacy-products/types/pharmacy-products.dto";
import type { RxOfferFormItem } from "../types/rx.offer.types";

export function mapOfferItemPharmacyProductToDto(
    item: RxOfferFormItem,
): PharmacyProductDto | null {
    if (!item.pharmacyProductId) return null;

    return {
        id: item.pharmacyProductId,
        manufacturer: null,
        name: item.label,
        strain: null,
        product_code: "",
        name_norm: "",
        strain_norm: "",
        is_active: true,
        rx_items_count: 0,
        prices: {
            base_price: item.unitPriceCents / 100,
            base_price_cents: item.unitPriceCents,
            price_other_provider: null,
            price_other_provider_cents: null,
            currency: "EUR",
        },
        created_at: "",
        updated_at: null,
    };
}