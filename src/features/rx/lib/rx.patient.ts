import type { RxListItemDto } from "../types/rx.dto";

export function rxHasPatientIssues(r: RxListItemDto): boolean {
    return Boolean(r.patient?.issues && Object.keys(r.patient.issues).length > 0);
}

export function rxHasAddressIssue(r: RxListItemDto): boolean {
    return Boolean(r.patient?.issues?.address_incomplete);
}

export function rxIsPatientMissing(r: RxListItemDto): boolean {
    return Boolean(r.patient?.issues?.patient_missing);
}