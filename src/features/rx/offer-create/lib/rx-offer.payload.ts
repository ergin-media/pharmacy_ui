import type {
    CreateRxOfferPayload,
    RxOfferFormValues,
} from "../types/rx.offer.types";

function normalizeOptionalText(value: string | null | undefined) {
    const normalized = String(value ?? "").trim();
    return normalized ? normalized : null;
}

function mapOfferItem(item: RxOfferFormValues["items"][number]) {
    return {
        item_id: item.id,
        label: item.label.trim(),
        quantity: item.quantity,
        unit: item.unit,
        unit_price_cents: item.unitPriceCents,
        total_price_cents: item.totalPriceCents,
    };
}

export function mapRxOfferFormToCreatePayload(
    values: RxOfferFormValues,
): CreateRxOfferPayload {
    return {
        rx_document_id: values.rxId,
        offer_number: values.offerNumber.trim(),
        issue_date: values.issueDate,
        notes: normalizeOptionalText(values.notes),
        subtotal_cents: values.subtotalCents,
        shipping_cents: values.shippingCents,
        total_cents: values.totalCents,
        items: values.items.map(mapOfferItem),
    };
}

export function mapRxOfferFormToPreviewPayload(values: RxOfferFormValues) {
    return {
        issue_date: values.issueDate,
        notes: normalizeOptionalText(values.notes),
        subtotal_cents: values.subtotalCents,
        shipping_cents: values.shippingCents,
        total_cents: values.totalCents,
        items: values.items.map(mapOfferItem),
    };
}
