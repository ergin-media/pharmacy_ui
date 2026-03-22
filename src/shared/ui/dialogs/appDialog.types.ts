import type { ReactNode } from "react";

export type AppConfirmDialogOptions = {
    title: string;
    description?: ReactNode;
    children?: ReactNode;
    icon?: ReactNode;

    confirmLabel?: string;
    cancelLabel?: string;

    isDangerous?: boolean;
    hideCancel?: boolean;

    onConfirm: () => void | Promise<void>;
    onCancel?: () => void;
};

export type AppConfirmDialogState = AppConfirmDialogOptions & {
    id: string;
    open: boolean;
    isLoading: boolean;
};