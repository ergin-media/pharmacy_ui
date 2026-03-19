import type { RxListItemDto } from "../../types/rx.dto";

export type MarkRxShippedInput = {
    id: number;
};

export type RxShipmentDto = {
    rx_document_id: number;
    shipped_by_user_id: number;
    shipped_at: string;
};

export type MarkRxShippedResponse = {
    ok: true;
    item: RxListItemDto;
    shipment: RxShipmentDto;
};