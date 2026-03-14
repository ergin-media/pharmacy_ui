import type { RxListItemDto } from "../../types/rx.dto";

export type RxOfferPricingMode = "provider_total" | "pharmacy_calculated";

export function detectOfferPricingMode(rx: RxListItemDto): RxOfferPricingMode {
    const priceSource = rx.provider?.price_source ?? null;

    if (priceSource === "provider_total") {
        return "provider_total";
    }

    return "pharmacy_calculated";
}

export function isProviderTotalPricing(mode: RxOfferPricingMode) {
    return mode === "provider_total";
}