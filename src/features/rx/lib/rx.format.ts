import type { RxListItemDto } from "../types/rx.dto";

type FormatRxPanelDescriptionOptions = {
    includePatient?: boolean;
};

export function formatRxTitle(rx: RxListItemDto): string {
    if (rx.external_order_id) {
        return `Rezept ${rx.external_order_id}`;
    }

    return `Rezept ${rx.id}`;
}

export function formatRxPanelDescription(
    rx: RxListItemDto,
    options: FormatRxPanelDescriptionOptions = {},
): string {
    const { includePatient = true } = options;

    const providerName = rx.provider?.name ?? "Unbekannt";

    const referencePart = rx.external_order_id
        ? `Bestellung ${rx.external_order_id}`
        : `Rezept ${rx.id}`;

    const patientName = includePatient
        ? [rx.patient?.first_name, rx.patient?.last_name]
              .filter(Boolean)
              .join(" ")
        : "";

    return [providerName, referencePart, patientName || null]
        .filter(Boolean)
        .join(" · ");
}
