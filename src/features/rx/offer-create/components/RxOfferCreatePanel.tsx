import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";

import type { RxListItemDto } from "../../types/rx.dto";
import { useRxOfferForm } from "../hooks/useRxOfferForm";
import { mapRxOfferFormToCreatePayload } from "../lib/rx-offer.payload";
import { useCreateOfferMutation } from "../queries/rx-offer.queries";
import { RxOfferForm } from "./RxOfferForm";
import { RxOfferPreview } from "./RxOfferPreview";
import { useSendOfferMutation } from "../../offer-send/queries/rx-offer-send.queries";

export function RxOfferCreatePanel(props: {
    rx: RxListItemDto;
    onCancel: () => void;
    onCreated: () => Promise<void> | void;
}) {
    const { rx, onCancel, onCreated } = props;

    const form = useRxOfferForm(rx);
    const createOfferMutation = useCreateOfferMutation();
    const sendOfferMutation = useSendOfferMutation();

    const isPending =
        createOfferMutation.isPending || sendOfferMutation.isPending;

    async function handleCreateAndSend() {
        const payload = mapRxOfferFormToCreatePayload(form.values);

        const createResult = await createOfferMutation.mutateAsync(payload);
        await sendOfferMutation.mutateAsync({
            offerId: createResult.offer.id,
        });

        await onCreated();
    }

    return (
        <div className="flex h-full min-h-0 flex-col">
            <div className="flex-1 overflow-auto">
                <div className="grid gap-6 pb-6 xl:grid-cols-[1.05fr_0.95fr]">
                    <div className="min-w-0">
                        <RxOfferForm
                            values={form.values}
                            onChange={form.actions.patch}
                            onItemChange={form.actions.updateItem}
                            onAddItem={form.actions.addItem}
                            onRemoveItem={form.actions.removeItem}
                        />
                    </div>

                    <div className="min-w-0">
                        <div className="sticky top-0">
                            <RxOfferPreview values={form.values} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="sticky bottom-0 px-1 pt-3">
                <div className="flex items-center justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        disabled={isPending}
                    >
                        Abbrechen
                    </Button>

                    <LoadingButton
                        loading={isPending}
                        onClick={handleCreateAndSend}
                    >
                        Angebot erstellen &amp; versenden
                    </LoadingButton>
                </div>
            </div>
        </div>
    );
}
