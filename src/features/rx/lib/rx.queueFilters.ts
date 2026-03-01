import type { RxQueue } from "./rx.queues";

export type RxListQueueParams = Partial<{
    workflow_status: "pending" | "processing" | "completed" | "rejected";
    payment_state: "unpaid" | "paid" | "refunded";
    parse_status: "pending" | "parsed" | "failed" | "parsed_with_warnings";
    fulfillment_type: "pickup" | "shipping" | "unknown";
    fulfillment_status: "none" | "packaging" | "ready" | "shipped" | "handed_over";
    has_issues: "1";
    has_warnings: "1";
    offer_sent: "1" | "0";
    paid: "1" | "0";
}>;

export function queueToParams(queue: RxQueue): RxListQueueParams {
    switch (queue) {
        case "inbox":
            return {
                // Neu: noch nicht sauber parsebar oder muss geprüft werden
                // (du kannst parsed_with_warnings hier oder in clarify führen)
                parse_status: "pending",
            };

        case "offer_create":
            return {
                workflow_status: "pending",
                payment_state: "unpaid",
                // parse_status: parsed/parsed_with_warnings -> wenn du es so im Backend kannst
            };

        case "await_payment":
            return {
                workflow_status: "processing",
                payment_state: "unpaid",
                offer_sent: "1",
            };

        case "paid_not_started":
            return {
                workflow_status: "processing",
                payment_state: "paid",
                fulfillment_status: "none",
            };

        case "packaging":
            return {
                workflow_status: "processing",
                payment_state: "paid",
                fulfillment_status: "packaging",
            };

        case "shipping":
            return {
                workflow_status: "processing",
                payment_state: "paid",
                fulfillment_type: "shipping",
                fulfillment_status: "ready",
            };

        case "pickup":
            return {
                workflow_status: "processing",
                payment_state: "paid",
                fulfillment_type: "pickup",
                fulfillment_status: "ready",
            };

        case "completed":
            return {
                workflow_status: "completed",
            };

        case "clarify":
            return {
                has_issues: "1",
            };

        default:
            return {};
    }
}