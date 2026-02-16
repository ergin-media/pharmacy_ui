import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useSlideInPanel } from "@/shared/ui/slide-in-panel/slideInPanel.store";
import { rxKeys } from "../queries/rx.queries";
import { RxInvoicePanel } from "../components/RxInvoicePanel";

export function useRxPanels() {
    const { openPanel } = useSlideInPanel();
    const queryClient = useQueryClient();

    const openInvoice = useCallback(
        (rxId: number) => {
            openPanel({
                title: "Rechnung erstellen",
                description: `RX #${rxId}`,
                variant: "md",
                render: ({ close }) => (
                    <RxInvoicePanel
                        rxId={rxId}
                        onCancel={close}
                        onCreated={async () => {
                            await queryClient.invalidateQueries({
                                queryKey: rxKeys.all,
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
    };
}
