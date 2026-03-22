import type { ReactNode } from "react";

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

type ConfirmDialogButtonVariant =
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";

export function ConfirmDialog(props: {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    title: string;
    description?: ReactNode;
    children?: ReactNode;
    icon?: ReactNode;

    confirmLabel?: string;
    cancelLabel?: string;

    confirmVariant?: ConfirmDialogButtonVariant;
    isDangerous?: boolean;

    isLoading?: boolean;
    confirmDisabled?: boolean;
    hideCancel?: boolean;

    onConfirm: () => void | Promise<void>;
    onCancel?: () => void;
}) {
    const {
        open,
        onOpenChange,
        title,
        description,
        children,
        icon,

        confirmLabel = "Bestätigen",
        cancelLabel = "Abbrechen",

        confirmVariant,
        isDangerous = false,

        isLoading = false,
        confirmDisabled = false,
        hideCancel = false,

        onConfirm,
        onCancel,
    } = props;

    const resolvedConfirmVariant: ConfirmDialogButtonVariant =
        confirmVariant ?? (isDangerous ? "destructive" : "default");

    function handleCancel() {
        onCancel?.();
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <div className="flex items-start gap-3">
                        {icon ? (
                            <div className="mt-0.5 shrink-0 text-muted-foreground">
                                {icon}
                            </div>
                        ) : null}

                        <div className="min-w-0 flex-1">
                            <DialogTitle>{title}</DialogTitle>

                            {description ? (
                                <DialogDescription>
                                    {description}
                                </DialogDescription>
                            ) : null}
                        </div>
                    </div>
                </DialogHeader>

                {children ? <div>{children}</div> : null}

                <DialogFooter>
                    {!hideCancel ? (
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isLoading}
                        >
                            {cancelLabel}
                        </Button>
                    ) : null}

                    <LoadingButton
                        variant={resolvedConfirmVariant}
                        loading={isLoading}
                        disabled={confirmDisabled || isLoading}
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}