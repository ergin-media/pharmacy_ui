import type { Id, ISODateTime, Sha256 } from "@/shared/types/db";

export type RxParseStatus =
    | "pending"
    | "parsed"
    | "failed"
    | "parsed_with_warnings";

export type RxFulfillmentType = "shipping" | "pickup" | "unknown";

// neu
export type RxWorkflowStatus =
    | "pending"
    | "processing"
    | "completed"
    | "rejected";
export type RxPaymentState = "unpaid" | "paid";

export interface RxListItemDto {
    id: Id;

    provider: {
        slug: string | null;
        name: string | null;
    };

    parse_status: RxParseStatus;

    // neu
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

    patient: {
        first_name: string | null;
        last_name: string | null;

        birthdate?: string | null;
        age?: number | null;

        street?: string | null;
        zip?: string | null;
        city?: string | null;
        country?: string | null;

        phone?: string | null;
        email?: string | null;
    };

    summary?: {
        items_preview?: Array<{
            name: string | null;
            unit: string | null;
            quantity: number | null;
        }>;
        items_count?: number | null;
        total_quantity?: number | null;
        total_unit?: string | null;
        final_price_cents?: number | null;
        currency?: string | null;
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

    // neu
    workflow_status?: RxWorkflowStatus;
    payment_state?: RxPaymentState;

    provider?: string;
    search?: string;
    sort?: string;
}
