import type { RxPaymentState, RxWorkflowStatus } from "../types/rx.dto";

// Hängt an deinen Badge-Variants (success/info/warning/neutral/destructive)
export type StatusBadgeVariant =
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "ghost"
    | "link"
    | "success"
    | "info"
    | "warning"
    | "neutral";

export function workflowBadgeVariant(
    status?: RxWorkflowStatus | null,
): StatusBadgeVariant {
    switch (status) {
        case "completed":
            return "success";
        case "processing":
            return "info";
        case "rejected":
            return "destructive";
        case "pending":
        default:
            return "neutral";
    }
}

export function paymentBadgeVariant(
    state?: RxPaymentState | null,
): StatusBadgeVariant {
    switch (state) {
        case "paid":
            return "success";
        case "unpaid":
        default:
            return "warning";
    }
}
