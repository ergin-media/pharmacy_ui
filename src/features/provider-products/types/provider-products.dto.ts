export type ProviderProductsMappedFilter = "" | "0" | "1";
// "" => alle, "0" => unmapped, "1" => mapped

export type ProviderProductsSort =
    | "usage_desc"
    | "usage_asc"
    | "updated_at_desc"
    | "updated_at_asc"
    | "created_at_desc"
    | "created_at_asc";

export type ProviderDto = {
    id: number;
    slug: string | null;
    name: string | null;
};

export type ProviderExternalDto = {
    name_raw: string | null;
    name_norm: string | null;
};

export type PharmacyProductMiniDto = {
    id: number;
    manufacturer: string | null;
    name: string | null;
    product_code: string | null;
    base_price: string | number | null;
    price_other_provider: string | number | null;
    is_active: boolean | null;
};

export type ProviderProductUsageDto = {
    count: number;
    last_used_at: string | null;
};

export type ProviderProductMapDto = {
    id: number;
    provider: ProviderDto;
    external: ProviderExternalDto;
    pharmacy_product: PharmacyProductMiniDto | null;
    usage: ProviderProductUsageDto;
    created_at: string | null;
    updated_at: string | null;
    is_mapped: boolean;
};

export type ProviderProductsListResponse = {
    ok: boolean;
    items: ProviderProductMapDto[];
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
};

export type ProviderProductsListParams = {
    page: number;
    per_page: number;
    mapped?: ProviderProductsMappedFilter; // "", "0", "1"
    search?: string; // external.name_raw
    sort?: ProviderProductsSort;
};
