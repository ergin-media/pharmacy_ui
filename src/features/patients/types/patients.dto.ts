import type { ISODate, RxPatient } from "@/shared/types/db";

/**
 * Patient Issue Codes
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

/**
 * Patient DTO (API Shape)
 */
export type PatientDto = Omit<
    RxPatient,
    "rx_document_id" | "patient_key" | "created_at"
> & {
    birthdate?: ISODate | null;
    age?: number | null;

    issues?: PatientIssues | null; // ✅ neu
};