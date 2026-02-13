import type { RxParseStatus } from "../types/rx.dto";

export const PER_PAGE_OPTIONS = [10, 25, 50, 100] as const;

export const SORT_OPTIONS = [
    { value: "created_at_desc", label: "Neueste zuerst" },
    { value: "created_at_asc", label: "Älteste zuerst" },
    { value: "received_at_desc", label: "Eingang: neueste zuerst" },
    { value: "received_at_asc", label: "Eingang: älteste zuerst" },
] as const;

export type RxSort = (typeof SORT_OPTIONS)[number]["value"];
export const DEFAULT_SORT: RxSort = "created_at_desc";
export const ALLOWED_SORTS = SORT_OPTIONS.map((s) => s.value) as RxSort[];

export const ALLOWED_STATUSES: RxParseStatus[] = [
    "pending",
    "parsed",
    "failed",
    "parsed_with_warnings",
];

export function badgeVariant(status: RxParseStatus) {
    switch (status) {
        case "parsed":
            return "secondary";
        case "failed":
            return "destructive";
        case "parsed_with_warnings":
            return "outline";
        default:
            return "outline";
    }
}
