import type { RxOfferPricingMode } from "../lib/rx-offer-pricing";

export type RxOfferFormItem = {
    id: number;
    label: string;
    quantity: number;
    unit: string;
    unitPriceCents: number;
    totalPriceCents: number;
};

export type RxOfferFormValues = {
    rxId: number;

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
    shipping_cents: number;
    items: CreateRxOfferItemPayload[];
};

export type CreateRxOfferResponseDto = {
    ok: true;
    offer_id: number;
    offer_number: string;
};
