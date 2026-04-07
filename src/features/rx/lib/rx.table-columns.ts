export type RxTableColumnKey =
    | "index"
    | "patient"
    | "provider"
    | "items"
    | "totalQty"
    | "totalPrice"
    | "receivedAt"
    | "status"
    | "issue"
    | "primaryAction"
    | "moreActions";

export const RX_TABLE_COLUMNS: RxTableColumnKey[] = [
    "index",
    "patient",
    "provider",
    "items",
    "totalQty",
    "totalPrice",
    "receivedAt",
    "status",
    "issue",
    "primaryAction",
    "moreActions",
];

export function getRxTableColumns(): RxTableColumnKey[] {
    return RX_TABLE_COLUMNS;
}

export function hasRxTableColumn(
    columns: RxTableColumnKey[],
    column: RxTableColumnKey,
): boolean {
    return columns.includes(column);
}
