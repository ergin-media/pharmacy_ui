import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useAppDialog } from "./appDialog.store";

export function AppDialogHost() {
    const { state, closeConfirm, runConfirm } = useAppDialog();

    const dialog = state.confirmDialog;

    if (!dialog) return null;

    return (
        <ConfirmDialog
            open={dialog.open}
            onOpenChange={(open) => {
                if (!open) {
                    dialog.onCancel?.();
                    closeConfirm();
                }
            }}
            title={dialog.title}
            description={dialog.description}
            icon={dialog.icon}
            confirmLabel={dialog.confirmLabel}
            cancelLabel={dialog.cancelLabel}
            isDangerous={dialog.isDangerous}
            hideCancel={dialog.hideCancel}
            isLoading={dialog.isLoading}
            onConfirm={runConfirm}
            onCancel={dialog.onCancel}
        >
            {dialog.children}
        </ConfirmDialog>
    );
}