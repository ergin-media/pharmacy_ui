import type { RxListItemDto } from "../../types/rx.dto";

export type StartRxPackagingInput = {
    id: number;
};

export type RxPackagingDto = {
    rx_document_id: number;
    started_by_user_id: number;
    prepared_at: string;
};

export type StartRxPackagingResponse = {
    ok: true;
    item: RxListItemDto;
    packaging: RxPackagingDto;
};
