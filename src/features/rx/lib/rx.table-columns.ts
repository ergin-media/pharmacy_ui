import type { RxQueue } from "./rx.queues";

export type RxTableColumnKey =
    | "index"
    | "patient"
    | "provider"
    | "items"
    | "totalQty"
    | "totalPrice"
    | "receivedAt"
    | "status"
    | "offerCreatedAt"
    | "paidAt"
    | "fulfillmentType"
    | "preparedAt"
    | "pickupReadyAt"
    | "completedAt"
    | "issue"
    | "primaryAction"
    | "moreActions";

export const RX_TABLE_BASE_COLUMNS: RxTableColumnKey[] = [
    "index",
    "patient",
    "provider",
    "items",
    "totalQty",
    "totalPrice",
];

const RX_TABLE_QUEUE_EXTRA_COLUMNS: Record<RxQueue, RxTableColumnKey[]> = {
    all: ["receivedAt", "status", "moreActions"],

    inbox: ["receivedAt", "primaryAction", "moreActions"],

    offer_create: ["receivedAt", "primaryAction", "moreActions"],

    await_payment: ["offerCreatedAt", "primaryAction", "moreActions"],

    paid_not_started: ["paidAt", "primaryAction", "moreActions"],

    packaging: ["fulfillmentType", "primaryAction", "moreActions"],

    shipping: ["preparedAt", "primaryAction", "moreActions"],

    pickup: ["pickupReadyAt", "primaryAction", "moreActions"],

    completed: ["completedAt", "moreActions"],

    clarify: ["issue", "status", "moreActions"],
};

export function getRxTableColumns(queue: RxQueue): RxTableColumnKey[] {
    return [
        ...RX_TABLE_BASE_COLUMNS,
        ...(RX_TABLE_QUEUE_EXTRA_COLUMNS[queue] ?? ["moreActions"]),
    ];
}

export function hasRxTableColumn(
    columns: RxTableColumnKey[],
    column: RxTableColumnKey,
): boolean {
    return columns.includes(column);
}
