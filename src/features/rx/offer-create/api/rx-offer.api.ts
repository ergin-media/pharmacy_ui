import { api } from "@/shared/api/axios";
import type {
    CreateRxOfferPayload,
    CreateRxOfferResponseDto,
} from "../types/rx.offer.types";

export async function createRxOffer(payload: CreateRxOfferPayload) {
    const res = await api.post<CreateRxOfferResponseDto>(
        `rx/${payload.rx_document_id}/offer-create`,
        payload,
    );

    return res.data;
}