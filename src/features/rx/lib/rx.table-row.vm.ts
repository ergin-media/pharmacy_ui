import type { RxListItemDto, RxParseStatus } from "../types/rx.dto";
import type { RxQueue } from "./rx.queues";
import { getPriceMeta } from "./rx.summary";
import { rxShouldShowReparse, rxUnmappedCount } from "./rx.reparse";
import { getRxQueuePrimaryAction } from "./rx.queue-actions";

import { formatDateTime } from "@/shared/lib/format/date";
import { formatMoney } from "@/shared/lib/format/money";
import { formatPersonName } from "@/shared/lib/format/person";
import { formatQuantity } from "@/shared/lib/format/quantity";

function formatOptionalDate(value?: string | null) {
    return value ? formatDateTime(value) : "—";
}

function getFulfillmentTypeLabel(rx: RxListItemDto) {
    const type = rx.fulfillment_type ?? rx.summary?.fulfillment_type ?? null;

    if (type === "shipping") return "Versand";
    if (type === "pickup") return "Abholung";

    return "—";
}

function getIssueLabel(rx: RxListItemDto, unmappedCount: number) {
    if (unmappedCount > 0) return `${unmappedCount} Artikel unmapped`;

    if (rx.parse?.flags?.pricing_base_price_missing) {
        return "Grundpreis fehlt";
    }

    if (rx.parse?.actions?.can_reparse) {
        return "Prüfung erforderlich";
    }

    if (rx.parse_status === "failed") {
        return "Parsing fehlgeschlagen";
    }

    if (rx.parse_status === "parsed_with_warnings") {
        return "Warnungen vorhanden";
    }

    return "Klärung erforderlich";
}

export type RxTableRowVm = {
    id: number;
    queue: RxQueue;
    rowNumber: number;

    patientTitle: string;
    patientSub: string;

    providerTitle: string;
    providerSub: string;

    rx: RxListItemDto;
    unmappedCount: number;

    totalQtyLabel: string;
    totalPriceLabel: string;
    totalPriceDimmed: boolean;

    receivedAtLabel: string;
    offerCreatedAtLabel: string;
    paidAtLabel: string;
    preparedAtLabel: string;
    pickupReadyAtLabel: string;
    completedAtLabel: string;

    fulfillmentTypeLabel: string;
    issueLabel: string;

    workflowStatus: RxListItemDto["workflow_status"];
    paymentState: RxListItemDto["payment_state"];
    parseStatus: RxParseStatus;

    showReparse: boolean;
    primaryActionLabel: string | null;
};

export function mapRxListItemToRowVm(input: {
    rx: RxListItemDto;
    queue: RxQueue;
    rowIndex: number;
    page: number;
    perPage: number;
}): RxTableRowVm {
    const { rx, queue, rowIndex, page, perPage } = input;

    const rowId = Number(rx.id);
    const rowNumber = Math.max(0, (page - 1) * perPage) + rowIndex + 1;

    const summary = rx.summary ?? undefined;
    const priceMeta = getPriceMeta(summary);

    const unmappedCount = rxUnmappedCount(rx);
    const showReparse = rxShouldShowReparse(rx, unmappedCount);

    const totalQty = summary?.total_quantity ?? null;
    const totalUnit = summary?.total_unit ?? null;

    const priceCents = summary?.final_price_cents ?? null;
    const currency = summary?.currency ?? "EUR";

    const patientTitle = formatPersonName(
        rx.patient?.first_name,
        rx.patient?.last_name,
    );
    const patientSub = rx.patient?.email ?? rx.patient?.phone ?? "—";

    const providerTitle = rx.provider?.name ?? rx.provider?.slug ?? "—";
    const providerSub = rx.external_order_id
        ? String(rx.external_order_id)
        : "—";

    return {
        id: rowId,
        queue,
        rowNumber,

        patientTitle,
        patientSub: `ID: ${rx.id} | ${patientSub}`,

        providerTitle,
        providerSub,

        rx,
        unmappedCount,

        totalQtyLabel: formatQuantity(totalQty, totalUnit),
        totalPriceLabel: formatMoney(priceCents, currency),
        totalPriceDimmed: !priceMeta.isComplete,

        receivedAtLabel: formatOptionalDate(rx.mail?.received_at),
        offerCreatedAtLabel: formatOptionalDate(rx.offer_created_at),
        paidAtLabel: formatOptionalDate(rx.paid_at),
        preparedAtLabel: formatOptionalDate(rx.prepared_at),
        pickupReadyAtLabel: formatOptionalDate(rx.pickup_ready_at),
        completedAtLabel: formatOptionalDate(rx.completed_at),

        fulfillmentTypeLabel: getFulfillmentTypeLabel(rx),
        issueLabel: getIssueLabel(rx, unmappedCount),

        workflowStatus: rx.workflow_status,
        paymentState: rx.payment_state,
        parseStatus: rx.parse_status as RxParseStatus,

        showReparse,
        primaryActionLabel: getRxQueuePrimaryAction(queue)?.label ?? null,
    };
}
