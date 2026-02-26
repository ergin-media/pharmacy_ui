import type { PatientDto } from "../types/patients.dto";

export function hasPatientIssues(p: PatientDto): boolean {
    return Boolean(p.issues && Object.keys(p.issues).length > 0);
}

export function hasAddressIssue(p: PatientDto): boolean {
    return Boolean(p.issues?.address_incomplete);
}