import type { PatientDto } from "@/features/patients/types/patients.dto";
import type {
    Id,
    ISODateTime,
    Sha256,
    RxParseStatus as DbRxParseStatus,
    FulfillmentType as DbFulfillmentType,
    RxUnit as DbRxUnit,
} from "@/shared/types/db";

export type RxParseStatus = DbRxParseStatus;
export type RxFulfillmentType = DbFulfillmentType;

export type RxWorkflowStatus =
    | "pending"
    | "processing"
    | "completed"
    | "rejected";

export type RxPaymentState = "unpaid" | "paid" | "refunded";



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

    provider: {
        slug: string | null;
        name: string | null;
        price_source?: string | null;
    };

    parse_status: RxParseStatus;

    workflow_status?: RxWorkflowStatus | null;
    payment_state?: RxPaymentState | null;

    created_at: ISODateTime;
    parsed_at: ISODateTime | null;

    rx_hash: Sha256;

    external_order_id?: string | null;
    fulfillment_type?: RxFulfillmentType | string | null;

    mail: {
        subject: string | null;
        from_email: string | null;
        received_at: ISODateTime | null;
    };

    /**
     * ✅ jetzt korrekt typisiert
     */
    patient: PatientDto;

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

export interface RxListResponseDto {
    items: RxListItemDto[];
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
}

export interface RxListQueryParams {
    page?: number;
    per_page?: number;
    parse_status?: RxParseStatus;

    workflow_status?: RxWorkflowStatus;
    payment_state?: RxPaymentState;

    provider?: string;
    search?: string;
    sort?: string;
}