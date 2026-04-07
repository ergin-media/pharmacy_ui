import type { RxStatus } from "../types/rx.dto";

export function getRxStatusBadge(status?: RxStatus | null) {
    switch (status) {
        case "new":
            return {
                label: "Neu",
                variant: "secondary",
            };

        case "processing":
            return {
                label: "In Bearbeitung",
                variant: "default",
            };

        case "completed":
            return {
                label: "Abgeschlossen",
                variant: "outline",
            };

        default:
            return {
                label: "Unbekannt",
                variant: "outline",
            };
    }
}
