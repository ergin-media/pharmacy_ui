import { api } from "@/shared/api/axios";
import type {
    SendRxOfferInput,
    SendRxOfferResponseDto,
} from "../types/rx-offer-send.types";

export async function sendRxOffer(input: SendRxOfferInput) {
    const res = await api.post<SendRxOfferResponseDto>(
        `rx-offers/${input.offerId}/send`,
        {},
    );

    return res.data;
}
