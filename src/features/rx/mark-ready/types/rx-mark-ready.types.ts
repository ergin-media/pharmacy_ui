import type { Id } from "@/shared/types/db";
import type { RxListItemDto } from "../../types/rx.dto";

export type MarkRxReadyFulfillmentType = "shipping" | "pickup";

export type MarkRxReadyInput = {
    id: Id;
    fulfillment_type: MarkRxReadyFulfillmentType;
};

export type RxReadyDto = {
    rx_document_id: Id;
    ready_by_user_id: Id;
    ready_at: string;
};

export type MarkRxReadyResponse = {
    ok: true;
    item: RxListItemDto;
    ready: RxReadyDto;
};