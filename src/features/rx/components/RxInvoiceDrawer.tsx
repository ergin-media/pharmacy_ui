import { SideSheet } from "@/components/ui/side-sheet";
import { RxInvoiceForm } from "./RxInvoiceForm";

export function RxInvoiceDrawer(props: {
    open: boolean;
    rxId: number | null;
    onOpenChange: (open: boolean) => void;

    onCancel: () => void;
    onCreated: () => void | Promise<void>;
}) {
    const { open, rxId, onOpenChange, onCancel, onCreated } = props;

    return (
        <SideSheet
            open={open}
            onOpenChange={onOpenChange}
            title="Rechnung erstellen"
            description={rxId ? `RX #${rxId}` : undefined}
            side="right"
        >
            {rxId ? (
                <RxInvoiceForm rxId={rxId} onCancel={onCancel} onCreated={onCreated} />
            ) : null}
        </SideSheet>
    );
}
