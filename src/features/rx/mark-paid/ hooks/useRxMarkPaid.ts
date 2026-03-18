// /features/rx/mark-paid/hooks/useRxMarkPaid.ts

import { useState } from "react";
import { useMarkRxPaidMutation } from "../queries/rx-mark-paid.queries";

function today() {
    return new Date().toISOString().slice(0, 10);
}

export function useRxMarkPaid(rxId: number) {
    const mutation = useMarkRxPaidMutation();

    const [paidAt, setPaidAt] = useState(today());

    async function submit() {
        await mutation.mutateAsync({
            id: rxId,
            paid_at: paidAt,
        });
    }

    return {
        paidAt,
        isPending: mutation.isPending,
        actions: {
            setPaidAt,
            submit,
        },
    };
}
