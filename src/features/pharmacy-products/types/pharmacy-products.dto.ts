export type PharmacyProductCurrency = "EUR";

export type PharmacyProductPricesDto = {
    base_price: number;
    base_price_cents: number;
    price_other_provider: number;
    price_other_provider_cents: number;
    currency: PharmacyProductCurrency;
};

export type PharmacyProductDto = {
    id: number;
    manufacturer: string | null;
    name: string;
    product_code: string;
    name_norm: string;
    is_active: boolean;
    prices: PharmacyProductPricesDto;
    created_at: string; // "YYYY-MM-DD HH:mm:ss"
    updated_at: string | null;
};

export type PharmacyProductsSort =
    | "created_at_desc"
    | "created_at_asc"
    | "name_asc"
    | "name_desc"
    | "price_asc"
    | "price_desc";

export type PharmacyProductsListParams = {
    page: number;
    per_page: number;
    active?: string; // "1" | "0" | "true" | "false" | undefined
    manufacturer?: string;
    search?: string;
    sort?: PharmacyProductsSort;
};

export type PharmacyProductsListResponse = {
    ok: true;
    items: PharmacyProductDto[];
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
};
