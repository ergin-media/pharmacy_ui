import type { RxQueueCounts } from "./rx.queues";

export function getTotalQueueCount(counts?: RxQueueCounts): number {
    if (!counts) return 0;

    let total = 0;

    for (const value of Object.values(counts)) {
        if (typeof value === "number") {
            total += value;
        }
    }

    return total;
}