import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { RxListItemDto } from "../../types/rx.dto";
import { useRxOfferForm } from "../hooks/useRxOfferForm";
import { RxOfferForm } from "./RxOfferForm";
import { RxOfferPreview } from "./RxOfferPreview";

export function RxOfferCreatePanel(props: {
    rx: RxListItemDto;
    onCancel: () => void;
    onCreated: () => Promise<void> | void;
}) {
    const { rx, onCancel, onCreated } = props;

    const form = useRxOfferForm(rx);

    return (
        <div className="grid h-full gap-4 xl:grid-cols-[1.05fr_0.95fr]">
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
                <div className="sticky top-0 grid gap-4">
                    <RxOfferPreview values={form.values} />

                    <Separator />

                    <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" onClick={onCancel}>
                            Abbrechen
                        </Button>

                        <Button onClick={() => onCreated()}>
                            Angebot erstellen
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
