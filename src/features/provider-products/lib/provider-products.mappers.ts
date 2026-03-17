import type { PharmacyProductDto } from "@/features/pharmacy-products/types/pharmacy-products.dto";
import type { ProviderProductMapDto } from "../types/provider-products.dto";

export function mapProviderMappingPharmacyProductToDto(
    pharmacyProduct: ProviderProductMapDto["pharmacy_product"] | null | undefined,
): PharmacyProductDto | null {
    if (!pharmacyProduct) return null;

    return {
        id: pharmacyProduct.id,
        manufacturer: pharmacyProduct.manufacturer,
        name: pharmacyProduct.name,
        strain: null,
        product_code: pharmacyProduct.product_code,
        name_norm: "",
        strain_norm: "",
        is_active: pharmacyProduct.is_active,
        rx_items_count: 0,
        prices: {
            base_price: 0,
            base_price_cents: 0,
            price_other_provider: null,
            price_other_provider_cents: null,
            currency: "EUR",
        },
        created_at: "",
        updated_at: null,
    };
}