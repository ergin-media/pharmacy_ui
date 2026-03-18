import type { Id, ISODateTime } from "@/shared/types/db";
import type { RxListItemDto } from "../../types/rx.dto";
import type { CreateRxOfferPayload } from "../../offer-create/types/rx.offer.types";

export type MarkRxPaidInput = {
    id: Id;
    paid_at: ISODateTime;
};

export type MarkRxPaidResponse = {
    ok: true;
    offer: CreateRxOfferPayload;
    item: RxListItemDto;
    payment: RxPaymentDto;
};

export type RxPaymentDto = {
    rx_document_id: Id;
    paid_by_user_id: Id;
    paid_at: ISODateTime;
};
