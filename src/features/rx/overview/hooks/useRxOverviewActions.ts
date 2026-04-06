import { useCallback, useMemo, useState } from "react";

import type { RxListItemDto } from "../../types/rx.dto";
import { useRxPanels } from "../../hooks/useRxPanels";
import {
    rxKeys,
    useTakeOverRxMutation,
} from "../../queries/rx.queries";
import { useQueryClient } from "@tanstack/react-query";

export function useRxOverviewActions() {
    const panels = useRxPanels();
    const queryClient = useQueryClient();

    const takeOverMutation = useTakeOverRxMutation();
    const [activeActionId, setActiveActionId] = useState<number | null>(null);

    const isActionPending = useMemo(
        () => takeOverMutation.isPending,
        [takeOverMutation.isPending],
    );

    const runPrimaryAction = useCallback(
        async (rx: RxListItemDto) => {
            setActiveActionId(Number(rx.id));

            try {
                const hasAttention =
                    (rx.summary?.unmapped_items_count ?? 0) > 0 ||
                    rx.summary?.price_is_complete === false ||
                    rx.parse?.flags?.pricing_base_price_missing === true;

                const isCompleted =
                    rx.workflow_status === "completed" ||
                    Boolean(rx.timeline?.completed_at);

                if (isCompleted) return;

                if (hasAttention) {
                    return;
                }

                if (!rx.timeline?.offer_created_at) {
                    panels.offerCreate.open(rx);
                    return;
                }

                if (!rx.timeline?.paid_at && rx.payment_state !== "paid") {
                    return;
                }

                if (!rx.timeline?.prepared_at) {
                    await takeOverMutation.mutateAsync(Number(rx.id));

                    await queryClient.invalidateQueries({
                        queryKey: rxKeys.lists(),
                    });

                    return;
                }

                return;
            } finally {
                setActiveActionId(null);
            }
        },
        [panels, queryClient, takeOverMutation],
    );

    return {
        activeActionId,
        isActionPending,
        actions: {
            runPrimaryAction,
        },
    };
}