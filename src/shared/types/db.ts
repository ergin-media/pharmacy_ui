// src/shared/types/db.ts
// Generated from DB schema (MySQL) – keep in sync with backend schema.
// Source tables: rx_document, rx_item, rx_patient, rx_workflow, mail_inbox, mail_attachment, provider, provider_alias, provider_product_map, pharmacy_product, audit_log, job_lock.

export type Id = number; // If you later return bigint IDs as string: change to `export type Id = string;`
export type ISODateTime = string; // "YYYY-MM-DD HH:mm:ss" or ISO string (depending on API)
export type ISODate = string; // "YYYY-MM-DD"
export type DecimalString = string; // e.g. "12.50"
export type Sha256 = string; // char(64)

// ---------- ENUMS (from schema) ----------

export type MailInboxStatus = "new" | "processed" | "failed";

export type RxParseStatus =
    | "pending"
    | "parsed"
    | "failed"
    | "parsed_with_warnings";

export type FulfillmentType = "pickup" | "shipping" | "unknown";

export type RxUnit = "g" | "mg" | "ml" | "pcs";

export type RxWorkflowState =
    | "received"
    | "parsed"
    | "needs_review"
    | "validated"
    | "rejected"
    | "assigned"
    | "completed";

// ---------- TABLE TYPES ----------

export interface AuditLog {
    id: Id;
    entity_type: string; // varchar(50)
    entity_id: Id; // bigint unsigned
    action: string; // varchar(50)
    actor: string | null; // varchar(120)
    detail: unknown | null; // json
    created_at: ISODateTime;
}

export interface JobLock {
    name: string; // varchar(80)
    locked_until: ISODateTime | null;
    locked_by: string | null; // varchar(120)
    updated_at: ISODateTime;
}

export interface MailInbox {
    id: Id;
    message_id: string;
    imap_uid: Id | null; // bigint unsigned
    provider_id: Id | null;

    from_name: string | null;
    from_email: string | null;
    subject: string | null;

    text_html: string | null; // mediumtext
    text_plain: string | null; // mediumtext

    received_at: ISODateTime | null;
    status: MailInboxStatus;
    error_message: string | null; // text
    created_at: ISODateTime;
}

export interface MailAttachment {
    id: Id;
    mail_id: Id;
    filename: string | null;
    mime_type: string | null;
    size_bytes: number | null; // int unsigned
    sha256: Sha256;
    storage_path: string; // varchar(600)
    created_at: ISODateTime;
}

export interface Provider {
    id: Id;
    slug: string; // varchar(80)
    display_name: string;
    is_active: boolean; // tinyint(1)
    created_at: ISODateTime;
}

export interface ProviderAlias {
    id: Id;
    provider_id: Id;
    pattern: string;
    created_at: ISODateTime;
}

export interface PharmacyProduct {
    id: Id;
    name: string;
    product_code: string | null; // varchar(12)
    base_price: DecimalString | null; // decimal(10,2)
    price_other_provider: DecimalString | null; // decimal(10,2)
    name_norm: string | null;
    is_active: boolean; // tinyint(1)
    created_at: ISODateTime;
    updated_at: ISODateTime | null;
}

export interface ProviderProductMap {
    id: Id;
    provider_id: Id;
    external_name_raw: string | null;
    external_name_norm: string;
    pharmacy_product_id: Id | null;
    created_at: ISODateTime;
    updated_at: ISODateTime | null;
}

export interface RxDocument {
    id: Id;
    mail_id: Id;
    attachment_id: Id;

    provider: string | null; // varchar(50)
    provider_id: Id | null;

    external_order_id: string | null; // varchar(64)
    fulfillment_type: FulfillmentType;

    rx_hash: Sha256;
    parse_status: RxParseStatus;

    parse_error: string | null; // text
    warnings_json: unknown | null; // json

    total_amount: DecimalString | null; // decimal(10,2)
    parsed_at: ISODateTime | null;
    created_at: ISODateTime;
}

export interface RxItem {
    id: Id;
    rx_document_id: Id;
    provider_product_map_id: Id | null;

    raw_product_name: string;
    normalized_product_name: string | null;

    sku: string | null;
    quantity: DecimalString | null; // decimal(10,2)
    unit: RxUnit | null; // enum default 'g' (can be null in schema?)
    dosage_notes: string | null;

    created_at: ISODateTime;
}

export interface RxPatient {
    id: Id;
    rx_document_id: Id;

    first_name: string | null;
    last_name: string | null;
    birthdate: ISODate | null;

    street: string | null;
    zip: string | null;
    city: string | null;
    country: string | null;

    phone: string | null;
    email: string | null;

    patient_key: Sha256 | null;
    created_at: ISODateTime;
}

export interface RxWorkflow {
    id: Id;
    rx_document_id: Id;

    state: RxWorkflowState;
    assigned_to: string | null; // varchar(120)
    note: string | null; // varchar(800)

    updated_at: ISODateTime;
    created_at: ISODateTime;
}

// ---------- Useful API wrappers ----------

export interface ApiListResponse<T> {
    data: T[];
    total: number;
}
