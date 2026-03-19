import { api } from "@/shared/api/axios";
import type {
    StartRxPackagingInput,
    StartRxPackagingResponse,
} from "../types/rx-start-packaging.types";

export async function startRxPackaging(input: StartRxPackagingInput) {
    const res = await api.post<StartRxPackagingResponse>(
        `rx/${input.id}/start-packaging`,
        {},
    );

    return res.data;
}
