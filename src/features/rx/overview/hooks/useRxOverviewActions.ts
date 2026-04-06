import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import type { RxListItemDto } from "../../types/rx.dto";
import { useRxPanels } from "../../hooks/useRxPanels";
import { rxKeys, useTakeOverRxMutation } from "../../queries/rx.queries";

export function useRxOverviewActions() {
    const panels = useRxPanels();
    const queryClient = useQueryClient();

    const takeOverMutation = useTakeOverRxMutation();
    const [activeActionId, setActiveActionId] = useState<number | null>(null);

    const open = useCallback(
        (rx: RxListItemDto) => {
            console.log("open rx", rx.id);
        },
        [],
    );

    const remove = useCallback(
        async (rx: RxListItemDto) => {
            console.log("delete rx", rx.id);

            // TODO:
            // hier später dialog + mutation zum löschen anschließen
            await queryClient.invalidateQueries({
                queryKey: rxKeys.lists(),
            });
        },
        [queryClient],
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

                if (isCompleted) {
                    return;
                }

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

                    return;
                }
            } finally {
                setActiveActionId(null);
            }
        },
        [panels, takeOverMutation],
    );

    return {
        activeActionId,
        actions: {
            runPrimaryAction,
            open,
            delete: remove,
        },
    };
}