import type { PatientsSort } from "../types/patients.list.dto";

export const DEFAULT_PER_PAGE = 20;
export const DEFAULT_SORT: PatientsSort = "created_at_desc";

export const ALLOWED_SORTS: readonly PatientsSort[] = [
    "created_at_desc",
    "created_at_asc",
    "last_name_asc",
    "last_name_desc",
] as const;

export const ISSUES_FILTER_OPTIONS = [
    { value: "all", label: "Alle" },
    { value: "with_issues", label: "Nur mit Problemen" },
] as const;
