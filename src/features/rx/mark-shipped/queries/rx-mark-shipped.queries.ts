import { useQueryClient } from "@tanstack/react-query";

import { getApiErrorMessage } from "@/shared/api/api-errors";
import { useToastMutation } from "@/shared/lib/react-query/create-toast-mutation";

import { rxKeys } from "../../queries/rx.queries";
import { rxBelongsToQueue } from "../../lib/rx.queue-matchers";
import type { RxQueue } from "../../lib/rx.queues";
import type { RxListResponseDto } from "../../types/rx.dto";

import { markRxShipped } from "../api/rx-mark-shipped.api";
import { MARK_SHIPPED_ERROR_MESSAGES } from "../lib/rx-mark-shipped.errors";

function getListParamsFromKey(queryKey: readonly unknown[]) {
    const maybeParams = queryKey[2];

    if (!maybeParams || typeof maybeParams !== "object") {
        return null;
    }

    return maybeParams as { queue?: RxQueue };
}

export function useMarkRxShippedMutation() {
    const qc = useQueryClient();

    return useToastMutation({
        mutationFn: markRxShipped,
        toastMessages: {
            loading: "Rezept wird als versendet markiert...",
            success: "Rezept wurde als versendet markiert",
            error: (error) =>
                getApiErrorMessage(error, {
                    fallback:
                        "Rezept konnte nicht als versendet markiert werden",
                    codeMap: MARK_SHIPPED_ERROR_MESSAGES,
                    statusMap: {
                        409: "Statuskonflikt – bitte Seite neu laden",
                    },
                }),
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