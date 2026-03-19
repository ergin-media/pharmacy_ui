import { api } from "@/shared/api/axios";
import type {
    MarkRxShippedInput,
    MarkRxShippedResponse,
} from "../types/rx-mark-shipped.types";

export async function markRxShipped(input: MarkRxShippedInput) {
    const res = await api.post<MarkRxShippedResponse>(
        `rx/${input.id}/mark-shipped`,
        {},
    );

    return res.data;
}