import type { RxPaymentState, RxWorkflowStatus } from "../types/rx.dto";

export function workflowLabel(status?: RxWorkflowStatus | null): string {
    switch (status) {
        case "processing":
            return "In Bearbeitung";
        case "completed":
            return "Abgeschlossen";
        case "rejected":
            return "Abgelehnt";
        case "pending":
        default:
            return "Offen";
    }
}

export function paymentLabel(state?: RxPaymentState | null): string {
    switch (state) {
        case "paid":
            return "Bezahlt";
        case "unpaid":
        default:
            return "Unbezahlt";
    }
}

export function orderLabel(externalOrderId?: string | null): string {
    return externalOrderId ? `ID: ${externalOrderId}` : "";
}
