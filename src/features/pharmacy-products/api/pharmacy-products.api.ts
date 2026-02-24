import type {
    PharmacyProductsListParams,
    PharmacyProductsListResponse,
} from "../types/pharmacy-products.dto";

function getApiBase() {
    // z.B. "/v1/" oder "https://api..."
    const base = import.meta.env.VITE_API_BASE ?? "/v1/";
    return base.endsWith("/") ? base.slice(0, -1) : base;
}

function buildQuery(params: Record<string, unknown>) {
    const sp = new URLSearchParams();

    Object.entries(params).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        const str = String(v).trim();
        if (str === "") return;
        sp.set(k, str);
    });

    return sp.toString();
}

export async function fetchPharmacyProducts(
    params: PharmacyProductsListParams,
): Promise<PharmacyProductsListResponse> {
    const qs = buildQuery(params);
    const url = `${getApiBase()}/pharmacy-products${qs ? `?${qs}` : ""}`;

    const res = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
        credentials: "include",
    });

    const data = (await res.json()) as PharmacyProductsListResponse;

    if (!res.ok) {
        const errorMessage =
            (data as { error?: { message?: string } })?.error?.message ??
            `Request failed (${res.status})`;
        throw new Error(errorMessage);
    }

    return data;
}
