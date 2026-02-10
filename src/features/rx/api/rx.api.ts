import { api } from "@/shared/api/axios";
import type { RxListQueryParams, RxListResponseDto } from "../types/rx.dto";

export async function fetchRxList(params: RxListQueryParams) {
    const res = await api.get<RxListResponseDto>("rx", { params });
    return res.data;
}
