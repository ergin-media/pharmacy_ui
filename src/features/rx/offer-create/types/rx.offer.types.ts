import type { RxListItemDto } from "../../types/rx.dto";
import type { RxOfferPricingMode } from "../lib/rx-offer-pricing";

export type RxOfferFormItem = {
    id: number;
    pharmacyProductId?: number | null;
    label: string;
    quantity: number;
    unit: string;
    unitPriceCents: number;
    totalPriceCents: number;
};

export type RxOfferFormValues = {
    rxId: number;

    providerName: string | null;

    offerNumber: string;
    currency: string;
    issueDate: string;

    patientFirstName: string;
    patientLastName: string;
    patientStreet: string;
    patientZip: string;
    patientCity: string;

    pricingMode: RxOfferPricingMode;
    providerTotalCents: number | null;

    items: RxOfferFormItem[];

    subtotalCents: number;
    shippingCents: number;
    totalCents: number;

    notes: string;
};

export type CreateRxOfferItemPayload = {
    item_id: number;
    label: string;
    quantity: number;
    unit: string;
    unit_price_cents: number;
};

export type CreateRxOfferPayload = {
    rx_document_id: number;
    offer_number: string;
    issue_date: string;
    notes: string | null;
    subtotal_cents: number;
    shipping_cents: number;
    total_cents: number;
    items: CreateRxOfferItemPayload[];
};

export type RxOfferDto = {
    id: number;
    rx_document_id: number;
    offer_number: string;
    issue_date: string;
    notes: string | null;
    shipping_cents: number;
    subtotal_cents: number;
    total_cents: number;
    currency: string;
    created_by_user_id: number;
    created_at: string;
    updated_at: string | null;
    items: Array<{
        id: number;
        rx_offer_id: number;
        rx_item_id: number;
        label: string;
        quantity: number;
        unit: string;
        unit_price_cents: number;
        line_total_cents: number;
        sort_order: number;
        created_at: string;
    }>;
};

export type CreateRxOfferResponseDto = {
    ok: true;
    offer: RxOfferDto;
    item: RxListItemDto;
};
