import type { PatientDto } from "./patients.dto";

export type PatientsSort =
    | "created_at_desc"
    | "created_at_asc"
    | "last_name_asc"
    | "last_name_desc";

export interface PatientsListParams {
    page?: number;
    per_page?: number;

    search?: string;
    sort?: PatientsSort;

    // optional, falls du direkt filtern willst
    issues?: "complete" | "missing" | "all";
}

export type PatientsIssues = NonNullable<PatientsListParams["issues"]>;

export interface PatientsListResponseDto {
    items: PatientDto[];
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
}
