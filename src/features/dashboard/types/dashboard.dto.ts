export type DashboardPeriod = "rolling_30d" | "mtd" | "prev_month" | "ytd";

export type DashboardTimeSeriesPointDto = {
    date: string; // "YYYY-MM-DD"
    revenue_total: number;
    revenue_paid: number;
    revenue_unpaid: number;
    rx_count: number;
};

export type DashboardOrdersDailyPointDto = {
    date: string; // "YYYY-MM-DD"
    orders_count: number;
};

export type DashboardRevenueCompareAlignedPointDto = {
    day: number;
    current: {
        revenue_total: number;
        revenue_paid: number;
        revenue_unpaid: number;
        rx_count: number;
    };
    prev: {
        revenue_total: number;
        revenue_paid: number;
        revenue_unpaid: number;
        rx_count: number;
    };
};

export type DashboardOrdersCompareAlignedPointDto = {
    day: number;
    current: {
        orders_count: number;
    };
    prev: {
        orders_count: number;
    };
};

export type DashboardTopProductDto = {
    id: number;
    manufacturer: string | null;
    name: string;
    product_code: string | null;
    rx_items_count: number;
    rx_documents_count: number;
    grams_total: number;
    revenue_estimated: number;
};

export type DashboardTopProviderDto = {
    id: number;
    slug: string | null;
    name: string | null;
    rx_documents_count: number;
};

export type DashboardResponseDto = {
    ok: boolean;
    period: DashboardPeriod;

    economy: {
        revenue_today: number;
        rx_count_today: number;
        revenue_month: number;
        revenue_prev_month: number;
        revenue_vs_prev_month_pct: number;
        rx_count_month: number;
        avg_rx_value_month: number;
        revenue_paid_month: number;
        revenue_unpaid_month: number;
        open_receivables: number;
    };

    operations: {
        workflow: {
            pending: number;
            processing: number;
            completed: number;
            rejected: number;
        };
        payment: {
            unpaid: number;
            paid: number;
        };
    };

    risk: {
        rx_with_unmapped_items: number;
        rx_with_pricing_base_price_missing: number;
        rx_with_patient_issues: number;
        products_missing_base_price: number;
        revenue_risk_total: number;
    };

    analytics: {
        top_products: DashboardTopProductDto[];
        top_providers: DashboardTopProviderDto[];
        avg_grams_per_rx_month: number;
        new_patients_30d: number;
    };

    timeseries?: {
        revenue_daily_current_month?: DashboardTimeSeriesPointDto[];
        revenue_daily_prev_month?: DashboardTimeSeriesPointDto[];
        revenue_daily_compare_aligned?: DashboardRevenueCompareAlignedPointDto[];
        revenue_daily?: DashboardTimeSeriesPointDto[];

        orders_daily_current_month?: DashboardOrdersDailyPointDto[];
        orders_daily_prev_month?: DashboardOrdersDailyPointDto[];
        orders_daily_compare_aligned?: DashboardOrdersCompareAlignedPointDto[];
        orders_daily?: DashboardOrdersDailyPointDto[];
    };

    _meta?: {
        generated_at: string;
        cache?: { hit: boolean; ttl_seconds: number };
    };
};

export type DashboardQueryParams = {
    period?: DashboardPeriod;
};