import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";

import { useRxManualCreateForm } from "../hooks/useRxManualCreateForm";
import { RxManualCreateForm } from "./RxManualCreateForm";
import { RxManualCreatePreview } from "./RxManualCreatePreview";
import { RxManualCreateUploadPanel } from "./RxManualCreateUploadPanel";

export function RxManualCreatePanel(props: {
    onCancel: () => void;
    onCreated?: () => Promise<void> | void;
}) {
    const { onCancel } = props;

    const form = useRxManualCreateForm();

    async function handleCreate() {
        console.log("manual rx values", form.values);
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
                    <Button variant="outline" onClick={onCancel}>
                        Abbrechen
                    </Button>

                    <LoadingButton loading={false} onClick={handleCreate}>
                        Rezept anlegen
                    </LoadingButton>
                </div>
            </div>
        </div>
    );
}