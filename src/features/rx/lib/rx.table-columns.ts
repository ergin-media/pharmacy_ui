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
    | "actions";

const RX_TABLE_BASE_COLUMNS: RxTableColumnKey[] = [
    "index",
    "patient",
    "provider",
    "items",
    "totalQty",
    "totalPrice",
];

const RX_TABLE_QUEUE_EXTRA_COLUMNS: Record<RxQueue, RxTableColumnKey[]> = {
    all: ["receivedAt", "status", "actions"],
    inbox: ["receivedAt", "actions"],
    offer_create: ["receivedAt", "actions"],
    await_payment: ["receivedAt", "actions"],
    paid_not_started: ["actions"],
    packaging: ["actions"],
    shipping: ["actions"],
    pickup: ["actions"],
    completed: ["receivedAt", "actions"],
    clarify: ["receivedAt", "status", "actions"],
};

export function getRxTableColumns(queue: RxQueue): RxTableColumnKey[] {
    return [
        ...RX_TABLE_BASE_COLUMNS,
        ...(RX_TABLE_QUEUE_EXTRA_COLUMNS[queue] ?? ["actions"]),
    ];
}

export function hasRxTableColumn(
    columns: RxTableColumnKey[],
    column: RxTableColumnKey,
): boolean {
    return columns.includes(column);
}
