import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";

export function ConfirmDialog(props: {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    title: string;
    description?: React.ReactNode;

    confirmLabel?: string;
    cancelLabel?: string;

    confirmVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    isLoading?: boolean;

    onConfirm: () => void | Promise<void>;
}) {
    const {
        open,
        onOpenChange,
        title,
        description,
        confirmLabel = "Bestätigen",
        cancelLabel = "Abbrechen",
        confirmVariant = "default",
        isLoading = false,
        onConfirm,
    } = props;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>

                    {description ? (
                        <DialogDescription>{description}</DialogDescription>
                    ) : null}
                </DialogHeader>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        {cancelLabel}
                    </Button>

                    <LoadingButton
                        variant={confirmVariant}
                        loading={isLoading}
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}