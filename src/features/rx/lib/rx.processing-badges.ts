import type { RxProcessingTab } from "./rx.processing-tabs";

export function getRxProcessingBadge(tab: RxProcessingTab | null) {
    switch (tab) {
        case "awaiting_payment":
            return {
                label: "Warten auf Zahlung",
                className: "bg-amber-50 text-amber-700 border border-amber-200",
            };

        case "paid":
            return {
                label: "Bezahlt",
                className: "bg-blue-50 text-blue-700 border border-blue-200",
            };

        case "shipping_ready":
            return {
                label: "Versandbereit",
                className:
                    "bg-violet-50 text-violet-700 border border-violet-200",
            };

        case "pickup_ready":
            return {
                label: "Abholbereit",
                className:
                    "bg-emerald-50 text-emerald-700 border border-emerald-200",
            };

        default:
            return null;
    }
}