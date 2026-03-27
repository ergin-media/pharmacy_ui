import type {
    CreateRxOfferPayload,
    RxOfferFormValues,
} from "../types/rx.offer.types";

export function mapRxOfferFormToCreatePayload(
    values: RxOfferFormValues,
): CreateRxOfferPayload {
    return {
        rx_document_id: values.rxId,
        offer_number: values.offerNumber,
        issue_date: values.issueDate,
        notes: values.notes || null,
        subtotal_cents: values.subtotalCents,
        shipping_cents: values.shippingCents,
        total_cents: values.totalCents,
        items: values.items.map((item) => ({
            item_id: item.id,
            label: item.label,
            quantity: item.quantity,
            unit: item.unit,
            unit_price_cents: item.unitPriceCents,
            total_price_cents: item.totalPriceCents,
        })),
    };
}

export function mapRxOfferFormToPreviewPayload(values: RxOfferFormValues) {
    return {
        issue_date: values.issueDate,
        notes: values.notes.trim() ? values.notes.trim() : null,
        shipping_cents: values.shippingCents,
        items: values.items.map((item) => ({
            item_id: item.id,
            label: item.label.trim(),
            quantity: item.quantity,
            unit: item.unit,
            unit_price_cents: item.unitPriceCents,
        })),
    };
}
