import { useCallback, useState } from "react";

export function useDrawer<TPayload = void>() {
    const [open, setOpen] = useState(false);
    const [payload, setPayload] = useState<TPayload | null>(null);

    const openFor = useCallback((value: TPayload) => {
        setPayload(value);
        setOpen(true);
    }, []);

    const openEmpty = useCallback(() => {
        setOpen(true);
    }, []);

    const close = useCallback(() => {
        setOpen(false);
    }, []);

    const reset = useCallback(() => {
        setOpen(false);
        setPayload(null);
    }, []);

    return {
        state: {
            open,
            payload,
        },
        actions: {
            setOpen,
            openFor,
            openEmpty,
            close,
            reset,
        },
    };
}
