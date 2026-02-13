import type { Id, ISODateTime, Sha256 } from "@/shared/types/db";

export type RxParseStatus =
    | "pending"
    | "parsed"
    | "failed"
    | "parsed_with_warnings";

export type RxFulfillmentType = "shipping" | "pickup" | "unknown";

export interface RxListItemDto {
    id: Id;

    provider: {
        slug: string | null;
        name: string | null;
    };

    parse_status: RxParseStatus;

    created_at: ISODateTime;
    parsed_at: ISODateTime | null;

    rx_hash: Sha256;

    // neu
    external_order_id?: string | null;
    fulfillment_type?: RxFulfillmentType | string | null;

    mail: {
        subject: string | null;
        from_email: string | null;
        received_at: ISODateTime | null;
    };

    // erweitert
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

    // neu (ersetzt die alten summary/phase2-extras)
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
    provider?: string;
    search?: string;
    sort?: string;
}
