import type { Id, ISODateTime, Sha256 } from "@/shared/types/db";

export type RxParseStatus =
    | "pending"
    | "parsed"
    | "failed"
    | "parsed_with_warnings";

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

    mail: {
        subject: string | null;
        from_email: string | null;
        received_at: ISODateTime | null;
    };

    patient: {
        first_name: string | null;
        last_name: string | null;
    };
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
}
