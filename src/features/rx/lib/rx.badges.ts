import type { RxStatus } from "../types/rx.dto";

export function getRxStatusBadge(status?: RxStatus | null) {
    switch (status) {
        case "new":
            return {
                label: "Neu",
                className: "bg-muted text-foreground border border-border",
            };

        case "processing":
            return {
                label: "In Bearbeitung",
                className: "bg-blue-50 text-blue-700 border border-blue-200",
            };

        case "completed":
            return {
                label: "Abgeschlossen",
                className: "bg-green-50 text-green-700 border border-green-200",
            };

        default:
            return {
                label: "Unbekannt",
                className:
                    "bg-muted text-muted-foreground border border-border",
            };
    }
}
