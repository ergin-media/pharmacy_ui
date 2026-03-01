export type ProviderProductsProviderDto = {
    id: number;
    slug: string;
    name: string;
    mappings_count: number;
    usage_count: number;
};

export type ProviderProductsProvidersResponseDto = {
    ok: true;
    items: ProviderProductsProviderDto[];
};
