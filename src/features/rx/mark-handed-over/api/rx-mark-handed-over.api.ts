import { api } from "@/shared/api/axios";
import type {
    MarkRxHandedOverInput,
    MarkRxHandedOverResponse,
} from "../types/rx-mark-handed-over.types";

export async function markRxHandedOver(input: MarkRxHandedOverInput) {
    const res = await api.post<MarkRxHandedOverResponse>(
        `rx/${input.id}/mark-handed-over`,
        {},
    );

    return res.data;
}