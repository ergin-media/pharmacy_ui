import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useSlideInPanel } from "@/shared/ui/slide-in-panel/slideInPanel.store";
import { rxKeys } from "../queries/rx.queries";
import { RxInvoicePanel } from "../components/RxInvoicePanel";
import { RxOfferCreatePanel } from "../offer-create/components/RxOfferCreatePanel";
import type { RxListItemDto } from "../types/rx.dto";

export function useRxPanels() {
    const { openPanel } = useSlideInPanel();
    const queryClient = useQueryClient();

    const openInvoice = useCallback(
        (rx: RxListItemDto) => {
            openPanel({
                title: "Rechnung erstellen",
                description: `RX #${rx.id}`,
                variant: "md",
                render: ({ close }) => (
                    <RxInvoicePanel
                        rxId={Number(rx.id)}
                        onCancel={close}
                        onCreated={async () => {
                            await queryClient.invalidateQueries({
                                queryKey: rxKeys.lists(),
                            });
                            close();
                        }}
                    />
                ),
            });
        },
        [openPanel, queryClient],
    );

    const openOfferCreate = useCallback(
        (rx: RxListItemDto) => {
            openPanel({
                title: "Angebot erstellen",
                description: `RX #${rx.id}`,
                variant: "lg",
                render: ({ close }) => (
                    <RxOfferCreatePanel
                        rx={rx}
                        onCancel={close}
                        onCreated={async () => {
                            await queryClient.invalidateQueries({
                                queryKey: rxKeys.lists(),
                            });
                            close();
                        }}
                    />
                ),
            });
        },
        [openPanel, queryClient],
    );

    return {
        invoice: {
            open: openInvoice,
        },
        offerCreate: {
            open: openOfferCreate,
        },
    };
}
