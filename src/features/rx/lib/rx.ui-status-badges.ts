import type { RxUiStatus } from "./rx.ui-status";

export function getRxUiStatusBadge(status: RxUiStatus) {
    switch (status) {
        case "new":
            return {
                label: "Neue Verordnung",
                className: "bg-muted text-foreground border border-border",
            };

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

        case "completed":
            return {
                label: "Abgeschlossen",
                className: "bg-green-50 text-green-700 border border-green-200",
            };

        case "attention":
            return {
                label: "Handlungsbedarf",
                className: "bg-red-50 text-red-700 border border-red-200",
            };
    }
}
