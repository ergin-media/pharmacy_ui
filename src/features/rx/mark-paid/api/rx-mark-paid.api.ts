import { api } from "@/shared/api/axios";
import type {
    MarkRxPaidInput,
    MarkRxPaidResponse,
} from "../types/rx-mark-paid.types";

export async function markRxPaid(input: MarkRxPaidInput) {
    const res = await api.post<MarkRxPaidResponse>(`rx/${input.id}/mark-paid`, {
        paid_at: input.paid_at,
    });

    return res.data;
}
