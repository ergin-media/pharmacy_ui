import { api } from "@/shared/api/axios";
import type {
    MarkRxReadyInput,
    MarkRxReadyResponse,
} from "../types/rx-mark-ready.types";

export async function markRxReady(input: MarkRxReadyInput) {
    const res = await api.post<MarkRxReadyResponse>(
        `rx/${input.id}/mark-ready`,
        {
            fulfillment_type: input.fulfillment_type,
        },
    );

    return res.data;
}