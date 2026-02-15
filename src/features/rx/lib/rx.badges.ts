import type { RxPaymentState, RxWorkflowStatus } from "../types/rx.dto";
import type { BadgeVariant } from "@/components/ui/badge";

export function workflowBadgeVariant(
    status?: RxWorkflowStatus | null,
): BadgeVariant {
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
): BadgeVariant {
    switch (state) {
        case "paid":
            return "success";
        case "unpaid":
        default:
            return "warning";
    }
}
