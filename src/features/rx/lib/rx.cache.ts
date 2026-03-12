import type { QueryClient } from "@tanstack/react-query";

import { rxKeys } from "../queries/rx.queries";
import type { RxListItemDto, RxListResponseDto } from "../types/rx.dto";
import type { RxQueue } from "./rx.queues";

function decrement(value?: number): number {
    return Math.max(0, (value ?? 0) - 1);
}

function increment(value?: number): number {
    return (value ?? 0) + 1;
}

export function removeRxFromListCache(
    queryClient: QueryClient,
    rxId: number,
    options?: {
        fromQueue?: RxQueue;
        toQueue?: RxQueue;
    },
) {
    queryClient.setQueriesData(
        { queryKey: rxKeys.lists() },
        (old: RxListResponseDto | undefined) => {
            if (!old?.items) return old;

            const hadItem = old.items.some((item) => Number(item.id) === rxId);

            if (!hadItem) return old;

            const nextItems = old.items.filter((item) => Number(item.id) !== rxId);

            const nextQueueCounts = { ...(old.queue_counts ?? {}) };

            if (options?.fromQueue) {
                nextQueueCounts[options.fromQueue] = decrement(
                    nextQueueCounts[options.fromQueue],
                );
            }

            if (options?.toQueue) {
                nextQueueCounts[options.toQueue] = increment(
                    nextQueueCounts[options.toQueue],
                );
            }

            return {
                ...old,
                items: nextItems,
                total: decrement(old.total),
                queue_counts: nextQueueCounts,
            };
        },
    );
}

export function replaceRxInListCache(
    queryClient: QueryClient,
    updatedItem: RxListItemDto,
) {
    queryClient.setQueriesData(
        { queryKey: rxKeys.lists() },
        (old: RxListResponseDto | undefined) => {
            if (!old?.items) return old;

            const hasItem = old.items.some(
                (item) => Number(item.id) === Number(updatedItem.id),
            );

            if (!hasItem) return old;

            return {
                ...old,
                items: old.items.map((item) =>
                    Number(item.id) === Number(updatedItem.id)
                        ? updatedItem
                        : item,
                ),
            };
        },
    );
}