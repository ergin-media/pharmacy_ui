import type { PatientDto } from "@/features/patients/types/patients.dto";
import type { ProviderProductsProviderDto } from "@/features/provider-products/types/providers.dto";

import type {
    Id,
    ISODateTime,
    Sha256,
    RxParseStatus as DbRxParseStatus,
    FulfillmentType as DbFulfillmentType,
    RxUnit as DbRxUnit,
} from "@/shared/types/db";

import type { RxQueue } from "../lib/rx.queues";

export type RxParseStatus = DbRxParseStatus;
export type RxFulfillmentType = DbFulfillmentType;

export type RxWorkflowStatus =
    | "pending"
    | "processing"
    | "completed"
    | "rejected";

export type RxPaymentState = "unpaid" | "paid" | "refunded";

/**
 * Timeline der Rezeptbearbeitung
 */
export type RxTimelineDto = {
    offer_created_at?: ISODateTime | null;
    offer_sent_at?: ISODateTime | null;

    paid_at?: ISODateTime | null;

    prepared_at?: ISODateTime | null;
    pickup_ready_at?: ISODateTime | null;

    completed_at?: ISODateTime | null;
    fulfilled_at?: ISODateTime | null;
};

/**
 * Erweiterter Provider-Typ für Rx-Kontext
 */
export type RxProviderDto = ProviderProductsProviderDto & {
    price_source?: string | null;
    mapping_required?: boolean | null;
};

export type RxItem = {
    id: Id;
    rx_document_id: Id;
    provider_product_map_id: Id | null;

    raw_product_name: string | null;
    normalized_product_name?: string | null;

    sku?: string | null;
    quantity: number | null;
    unit: DbRxUnit | string | null;

    dosage_notes?: string | null;
    created_at?: ISODateTime | null;

    mapping?: {
        pharmacy_product_id?: number | null;
        has_pharmacy_product?: boolean | 0 | 1 | null;
    } | null;
};

export interface RxListItemDto {
    id: Id;

    provider: RxProviderDto | null;

    parse_status: RxParseStatus;

    workflow_status?: RxWorkflowStatus | null;
    payment_state?: RxPaymentState | null;

    created_at: ISODateTime;
    parsed_at: ISODateTime | null;

    rx_hash: Sha256;

    external_order_id?: string | null;

    fulfillment_type?: RxFulfillmentType | string | null;
    fulfillment_status?: string | null;

    mail: {
        subject: string | null;
        from_email: string | null;
        received_at: ISODateTime | null;
    };

    patient: PatientDto;

    timeline?: RxTimelineDto | null;

    summary?: {
        items_count?: number | null;

        total_quantity?: number | null;
        total_unit?: string | null;

        unmapped_items_count?: number | null;
        price_is_complete?: boolean | null;

        final_price_cents?: number | null;
        currency?: string | null;
    } | null;

    items?: RxItem[] | null;

    parse?: {
        error?: string | null;

        warnings?: Array<{
            code: string;
            field?: string | null;
            message?: string | null;
        }> | null;

        flags?: Record<string, boolean> | null;

        actions?: {
            can_reparse?: boolean | null;
        } | null;
    } | null;
}

export type RxQueueCounts = Partial<Record<RxQueue, number>>;

export interface RxListResponseDto {
    items: RxListItemDto[];
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    queue_counts: RxQueueCounts;
}

export interface RxListQueryParams {
    page?: number;
    per_page?: number;

    /**
     * Backend Queue Filter
     */
    queue?: RxQueue;

    parse_status?: RxParseStatus;
    workflow_status?: RxWorkflowStatus;
    payment_state?: RxPaymentState;

    provider?: string;
    search?: string;
    sort?: string;
}
