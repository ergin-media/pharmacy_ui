import { api } from "@/shared/api/axios";
import type {
    CreateRxOfferPayload,
    CreateRxOfferResponseDto,
} from "../types/rx.offer.types";

export async function createAndSendRxOffer(payload: CreateRxOfferPayload) {
    const res = await api.post<CreateRxOfferResponseDto>(
        `rx/${payload.rx_document_id}/offer-create-and-send`,
        payload,
    );

    return res.data;
}

export async function previewRxOfferPdf(input: {
    rxId: number;
    payload: {
        issue_date: string;
        notes: string | null;
        shipping_cents: number;
        items: Array<{
            item_id: number;
            label: string;
            quantity: number;
            unit: string;
            unit_price_cents: number;
        }>;
    };
}) {
    const res = await api.post(
        `rx/${input.rxId}/offer-preview-pdf`,
        input.payload,
        {
            responseType: "blob",
        },
    );

    return res.data as Blob;
}