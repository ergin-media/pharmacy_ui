import { useCallback } from "react";

import { useSlideInPanel } from "@/shared/ui/slide-in-panel/slideInPanel.store";
import { RxInvoicePanel } from "../components/RxInvoicePanel";
import { RxOfferCreatePanel } from "../offer-create/components/RxOfferCreatePanel";
import type { RxListItemDto } from "../types/rx.dto";

export function useRxPanels() {
    const { openPanel } = useSlideInPanel();

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
                            close();
                        }}
                    />
                ),
            });
        },
        [openPanel],
    );

    const openOfferCreate = useCallback(
        (rx: RxListItemDto) => {
            openPanel({
                title: "Angebot erstellen",
                description: `RX #${rx.id}`,
                variant: "custom",
                widthClassName: "w-[95vw] max-w-[1500px]",
                render: ({ close }) => (
                    <RxOfferCreatePanel
                        rx={rx}
                        onCancel={close}
                        onCreated={async () => {
                            close();
                        }}
                    />
                ),
            });
        },
        [openPanel],
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