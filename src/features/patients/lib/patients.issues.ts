import type {
    PatientDto,
    PatientIssues,
    PatientIssueCode,
} from "../types/patients.dto";

export function patientIssuesCount(issues?: PatientIssues | null): number {
    if (!issues) return 0;
    return Object.keys(issues).length;
}

export function patientHasIssues(p: PatientDto): boolean {
    return patientIssuesCount(p.issues) > 0;
}

const ISSUE_LABELS: Record<PatientIssueCode, string> = {
    patient_missing: "Patient fehlt",
    first_name_missing: "Vorname fehlt",
    last_name_missing: "Nachname fehlt",
    birthdate_missing: "Geburtsdatum fehlt",
    email_missing: "E-Mail fehlt",
    phone_missing: "Telefon fehlt",
    street_missing: "Straße fehlt",
    zip_missing: "PLZ fehlt",
    city_missing: "Ort fehlt",
    country_missing: "Land fehlt",
    address_incomplete: "Adresse unvollständig",
};

export function patientIssuesLabel(
    issues?: PatientIssues | null,
): string | null {
    if (!issues) return null;
    const keys = Object.keys(issues) as PatientIssueCode[];
    if (keys.length === 0) return null;

    // kurze Summary
    if (keys.length === 1) return ISSUE_LABELS[keys[0]];

    // Priorisiere address_incomplete, dann “x Probleme”
    if (issues.address_incomplete) return "Adresse unvollständig";
    return `${keys.length} Probleme`;
}
