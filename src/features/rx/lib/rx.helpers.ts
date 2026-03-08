import type { RxQueueCounts } from "./rx.queues";

export function getTotalQueueCount(counts?: RxQueueCounts): number {
    return Object.values(counts ?? {}).reduce(
        (total, value) => total + (value ?? 0),
        0,
    );
}