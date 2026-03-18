import { useQueryClient } from "@tanstack/react-query";

import { markRxPaid } from "../api/rx-mark-paid.api";

import { rxKeys } from "@/features/rx/queries/rx.queries";
import type { RxListResponseDto } from "@/features/rx/types/rx.dto";
import type { RxQueue } from "@/features/rx/lib/rx.queues";
import { rxBelongsToQueue } from "@/features/rx/lib/rx.queue-matchers";
import { useToastMutation } from "@/shared/lib/react-query/create-toast-mutation";

function getListParamsFromKey(queryKey: readonly unknown[]) {
    const maybeParams = queryKey[2];

    if (!maybeParams || typeof maybeParams !== "object") {
        return null;
    }

    return maybeParams as { queue?: RxQueue };
}

export function useMarkRxPaidMutation() {
    const qc = useQueryClient();

    return useToastMutation({
        mutationFn: markRxPaid,

        toastMessages: {
            loading: "Zahlung wird bestätigt...",
            success: "Zahlung bestätigt",
            error: "Fehler beim Bestätigen",
        },

        onSuccess: async (data) => {
            const updatedRx = data.item;

            const queries = qc.getQueriesData<RxListResponseDto>({
                queryKey: rxKeys.lists(),
            });

            for (const [queryKey, old] of queries) {
                if (!old?.items) continue;

                const params = getListParamsFromKey(queryKey);
                const queue = params?.queue;

                const belongs = rxBelongsToQueue(updatedRx, queue);

                const nextItems = belongs
                    ? old.items.map((item) =>
                          item.id === updatedRx.id ? updatedRx : item,
                      )
                    : old.items.filter((item) => item.id !== updatedRx.id);

                qc.setQueryData<RxListResponseDto>(queryKey, {
                    ...old,
                    items: nextItems,
                });
            }

            await qc.invalidateQueries({
                queryKey: rxKeys.lists(),
            });
        },
    });
}
