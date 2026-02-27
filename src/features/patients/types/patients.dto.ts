// features/patients/types/patients.dto.ts
import type { Id, ISODate, ISODateTime, Sha256 } from "@/shared/types/db";

/**
 * Patient Issue Codes (aus Backend)
 */
export type PatientIssueCode =
    | "patient_missing"
    | "first_name_missing"
    | "last_name_missing"
    | "birthdate_missing"
    | "email_missing"
    | "phone_missing"
    | "street_missing"
    | "zip_missing"
    | "city_missing"
    | "country_missing"
    | "address_incomplete";

export type PatientIssues = Partial<Record<PatientIssueCode, true>>;

export type PatientStatusDto = {
    is_complete: boolean;
    issues: PatientIssues | null;
};

export type PatientDto = {
    id: Id;
    rx_document_id: Id;
    patient_key: Sha256 | null;

    first_name: string | null;
    last_name: string | null;
    birthdate: ISODate | null;
    street: string | null;
    zip: string | null;
    city: string | null;
    country: string | null;
    phone: string | null;
    email: string | null;
    age?: number | null;
    status?: PatientStatusDto | null;

    created_at: ISODateTime;
};
