import { api } from "@/shared/api/axios";
import type {
    RxListQueryParams,
    RxListResponseDto,
    RxListItemDto,
} from "../types/rx.dto";

export async function fetchRxList(params: RxListQueryParams) {
    const res = await api.get<RxListResponseDto>("rx", { params });
    return res.data;
}

export async function reparseRx(id: number) {
    const res = await api.post<{
        item: RxListItemDto;
        reparse: {
            rx_document_id: number;
            parsed: number;
            failed: number;
        };
    }>(`rx/${id}/reparse`);

    return res.data;
}

export async function takeOverRx(id: number) {
    const res = await fetch(`/api/rx/${id}/take-over`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        throw new Error("Rezept konnte nicht übernommen werden.");
    }

    return res.json();
}
