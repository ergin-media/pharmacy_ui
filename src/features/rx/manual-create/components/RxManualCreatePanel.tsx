import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";

import { useRxManualCreateForm } from "../hooks/useRxManualCreateForm";
import { useCreateManualRxMutation } from "../hooks/useCreateManualRxMutation";
import { buildManualRxFormData } from "../lib/rx-manual-create.payload";

import { RxManualCreateForm } from "./RxManualCreateForm";
import { RxManualCreatePreview } from "./RxManualCreatePreview";
import { RxManualCreateUploadPanel } from "./RxManualCreateUploadPanel";

export function RxManualCreatePanel(props: {
    onCancel: () => void;
    onCreated?: () => Promise<void> | void;
}) {
    const { onCancel, onCreated } = props;

    const form = useRxManualCreateForm();
    const createManualRxMutation = useCreateManualRxMutation();

    async function handleCreate() {
        if (!form.values.patientFirstName.trim()) return;
        if (!form.values.patientLastName.trim()) return;
        if (!form.values.documentFile) return;
        if (
            form.values.items.length === 0 ||
            form.values.items.some(
                (item) =>
                    !item.label.trim() ||
                    !item.quantity ||
                    !String(item.unit).trim(),
            )
        ) {
            return;
        }

        const formData = buildManualRxFormData(form.values);

        await createManualRxMutation.mutateAsync(formData);

        await onCreated?.();
    }

    return (
        <div className="flex h-full min-h-0 flex-col">
            <div className="flex-1 overflow-auto">
                <div className="grid gap-6 pb-6 xl:grid-cols-[1.05fr_0.95fr]">
                    <div className="min-w-0">
                        <RxManualCreateForm
                            values={form.values}
                            onChange={form.actions.patch}
                            onItemChange={form.actions.updateItem}
                            onAddItem={form.actions.addItem}
                            onRemoveItem={form.actions.removeItem}
                        />
                    </div>

                    <div className="min-w-0">
                        <div className="sticky top-0 grid gap-4">
                            <RxManualCreateUploadPanel
                                file={form.values.documentFile}
                                onFileSelect={form.actions.setDocumentFile}
                            />

                            <RxManualCreatePreview
                                previewUrl={form.values.documentPreviewUrl}
                                mimeType={form.values.documentMimeType}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="sticky bottom-0 px-1 pt-3">
                <div className="flex items-center justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        disabled={createManualRxMutation.isPending}
                    >
                        Abbrechen
                    </Button>

                    <LoadingButton
                        loading={createManualRxMutation.isPending}
                        onClick={handleCreate}
                    >
                        Rezept anlegen
                    </LoadingButton>
                </div>
            </div>
        </div>
    );
}