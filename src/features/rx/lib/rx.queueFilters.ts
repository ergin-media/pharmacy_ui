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