import { api } from "@/shared/api/axios";
import type { RxListItemDto } from "../../types/rx.dto";
import type { MarkRxPaidInput } from "../types/rx-mark-paid.types";

export async function markRxPaid(input: MarkRxPaidInput) {
    const res = await api.post<{
        rx: RxListItemDto;
    }>(`rx/${input.id}/mark-paid`, {
        paid_at: input.paid_at,
    });

    return res.data;
}
