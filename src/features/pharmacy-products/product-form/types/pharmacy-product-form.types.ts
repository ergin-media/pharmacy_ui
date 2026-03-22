import type { PharmacyProductDto } from "../../types/pharmacy-products.dto";

export type PharmacyProductFormValues = {
    id?: number;

    name: string;
    product_code: string;

    manufacturer: string;
    strain: string;

    base_price_cents: number;
    price_other_provider_cents: number | null;
    currency: string;

    is_active: boolean;
};

export type CreatePharmacyProductPayload = {
    name: string;
    product_code: string;
    manufacturer: string | null;
    strain: string | null;
    base_price_cents: number;
    price_other_provider_cents: number | null;
    is_active: boolean;
};

export type UpdatePharmacyProductPayload = {
    id: number;
    name: string;
    product_code: string;
    manufacturer: string | null;
    strain: string | null;
    base_price_cents: number;
    price_other_provider_cents: number | null;
    is_active: boolean;
};

export type SavePharmacyProductResponse = {
    ok: true;
    item: PharmacyProductDto;
};