import { api } from "@/shared/api/axios";
import type {
    SendRxOfferInput,
    SendRxOfferResponseDto,
} from "../types/rx-offer-send.types";

export async function sendRxOffer(input: SendRxOfferInput) {
    const res = await api.post<SendRxOfferResponseDto>(
        `rx/${input.offerId}/offer-send`,
        {},
    );

    return res.data;
}
