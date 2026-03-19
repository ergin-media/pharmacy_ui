import { useQueryClient } from "@tanstack/react-query";

import { startRxPackaging } from "../api/rx-start-packaging.api";
import { START_PACKAGING_ERROR_MESSAGES } from "../lib/rx-start-packaging.errors";

import { rxKeys } from "@/features/rx/queries/rx.queries";
import type { RxListResponseDto } from "@/features/rx/types/rx.dto";
import type { RxQueue } from "@/features/rx/lib/rx.queues";
import { rxBelongsToQueue } from "@/features/rx/lib/rx.queue-matchers";

import { getApiErrorMessage } from "@/shared/api/api-errors";
import { useToastMutation } from "@/shared/lib/react-query/create-toast-mutation";

function getListParamsFromKey(queryKey: readonly unknown[]) {
    const maybeParams = queryKey[2];

    if (!maybeParams || typeof maybeParams !== "object") {
        return null;
    }

    return maybeParams as { queue?: RxQueue };
}

export function useStartRxPackagingMutation() {
    const qc = useQueryClient();

    return useToastMutation({
        mutationFn: startRxPackaging,
        toastMessages: {
            loading: "Rezept wird in Vorbereitung gesetzt...",
            success: "Rezept ist jetzt in Vorbereitung",
            error: (error) =>
                getApiErrorMessage(error, {
                    fallback:
                        "Rezept konnte nicht in Vorbereitung gesetzt werden",
                    codeMap: START_PACKAGING_ERROR_MESSAGES,
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
