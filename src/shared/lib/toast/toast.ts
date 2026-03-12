import { toast } from "sonner";
import { TOAST_DURATION } from "./toast.config";

export const appToast = {
    success: (message: string) =>
        toast.success(message, {
            duration: TOAST_DURATION.success,
        }),

    info: (message: string) =>
        toast(message, {
            duration: TOAST_DURATION.info,
        }),

    warning: (message: string) =>
        toast.warning(message, {
            duration: TOAST_DURATION.warning,
        }),

    error: (message: string) =>
        toast.error(message, {
            duration: TOAST_DURATION.error,
        }),

    loading: (message: string, id?: string) =>
        toast.loading(message, {
            id,
            duration: TOAST_DURATION.loading,
        }),

    dismiss: (id?: string) => toast.dismiss(id),
};