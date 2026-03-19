import type { RxListItemDto } from "../../types/rx.dto";

export type MarkRxHandedOverInput = {
    id: number;
};

export type RxHandoverDto = {
    rx_document_id: number;
    handed_over_by_user_id: number;
    handed_over_at: string;
};

export type MarkRxHandedOverResponse = {
    ok: true;
    item: RxListItemDto;
    handover: RxHandoverDto;
};