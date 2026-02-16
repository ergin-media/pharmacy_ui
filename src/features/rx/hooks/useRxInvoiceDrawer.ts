import { useCallback, useState } from "react";

export function useRxInvoiceDrawer(props: {
    onCreated?: (rxId: number) => void | Promise<void>;
}) {
    const { onCreated } = props;

    const [open, setOpen] = useState(false);
    const [rxId, setRxId] = useState<number | null>(null);

    const openFor = useCallback((id: number) => {
        setRxId(id);
        setOpen(true);
    }, []);

    const close = useCallback(() => {
        setOpen(false);
    }, []);

    const handleCreated = useCallback(async () => {
        if (rxId == null) return;
        await onCreated?.(rxId);
        setOpen(false);
    }, [onCreated, rxId]);

    return {
        state: { open, rxId },
        actions: { setOpen, openFor, close, onCreated: handleCreated },
    };
}
