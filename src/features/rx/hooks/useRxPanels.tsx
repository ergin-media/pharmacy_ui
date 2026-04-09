import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useSlideInPanel } from "@/shared/ui/slide-in-panel/slideInPanel.store";
import { RxInvoicePanel } from "../components/RxInvoicePanel";
import { RxOfferCreatePanel } from "../offer-create/components/RxOfferCreatePanel";
import { RxManualCreatePanel } from "../manual-create/components/RxManualCreatePanel";
import { RxPickupReadyPanelContent } from "../pickup-ready/components/RxPickupReadyPanelContent";
import { rxKeys } from "../queries/rx.queries";
import type { RxListItemDto } from "../types/rx.dto";
import { formatRxPanelDescription } from "../lib/rx.format";

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
                description: formatRxPanelDescription(rx),
                variant: "custom",
                widthClassName: "w-[95vw] max-w-[1500px]",
                render: ({ close }) => (
                    <RxOfferCreatePanel
                        rx={rx}
                        onCancel={close}
                        onCreated={async () => {
                            close();

                            await queryClient.invalidateQueries({
                                queryKey: rxKeys.lists(),
                            });
                        }}
                    />
                ),
            });
        },
        [openPanel, queryClient],
    );

    const openManualCreate = useCallback(() => {
        openPanel({
            title: "Rezept manuell anlegen",
            variant: "custom",
            widthClassName: "w-[95vw] max-w-[1500px]",
            render: ({ close }) => (
                <RxManualCreatePanel
                    onCancel={close}
                    onCreated={async () => {
                        close();

                        await queryClient.invalidateQueries({
                            queryKey: rxKeys.lists(),
                        });
                    }}
                />
            ),
        });
    }, [openPanel, queryClient]);

    const openShippingReady = useCallback(
        (rx: RxListItemDto) => {
            openPanel({
                title: "Versand vorbereiten",
                description: formatRxPanelDescription(rx),
                variant: "custom",
                widthClassName: "w-[95vw] max-w-[1000px]",
                render: ({ close }) => (
                    <RxPickupReadyPanelContent
                        rx={rx}
                        trackingId={null}
                        isCreatingLabel={false}
                        onCreateLabel={() => {
                            console.log("create dhl label", rx.id);
                        }}
                    />
                ),
            });
        },
        [openPanel],
    );

    const openPickupReady = useCallback(
        (rx: RxListItemDto) => {
            openPanel({
                title: "Abholung vorbereiten",
                description: formatRxPanelDescription(rx),
                variant: "custom",
                widthClassName: "w-[95vw] max-w-[900px]",
                render: ({ close }) => (
                    <RxPickupReadyPanelContent
                        rx={rx}
                        pickupMailSentAt={null}
                        isSending={false}
                        onSendPickupMail={() => {
                            console.log("send pickup mail", rx.id);
                        }}
                        onResendPickupMail={() => {
                            console.log("resend pickup mail", rx.id);
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
        manualCreate: {
            open: openManualCreate,
        },
        shippingReady: {
            open: openShippingReady,
        },
        pickupReady: {
            open: openPickupReady,
        },
    };
}
