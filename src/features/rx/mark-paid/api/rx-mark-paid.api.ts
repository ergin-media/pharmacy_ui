import { api } from "@/shared/api/axios";
import type { RxListItemDto } from "../../types/rx.dto";
import type { MarkRxPaidInput } from "../types/rx-mark-paid.types";

export async function markRxPaid(input: MarkRxPaidInput) {
    const res = await api.post<{
        ok: true;
        offer: unknown;
        item: RxListItemDto;
        payment: {
            rx_document_id: number;
            paid_by_user_id: number;
            paid_at: string;
        };
    }>(`rx/${input.id}/mark-paid`, {
        paid_at: input.paid_at,
    });

    return res.data;
}
