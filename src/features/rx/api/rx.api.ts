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
    const res = await api.post<{
        ok: true;
        item: RxListItemDto;
    }>(`rx/${id}/take-over`);

    return res.data;
}

export async function assignRxMappings(input: {
    rx_document_id: number;
    mappings: Array<{
        rx_item_id: number;
        provider_product_map_id: number;
        pharmacy_product_id: number | null;
    }>;
}) {
    const { rx_document_id, mappings } = input;

    const res = await api.patch<{
        rx: RxListItemDto;
    }>(`/v1/rx/${rx_document_id}/mappings`, {
        mappings,
    });

    return res.data;
}
