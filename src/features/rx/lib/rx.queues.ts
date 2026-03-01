// src/features/rx/lib/rx.queues.ts
export type RxQueue =
    | "inbox"               // 1 Eingang / Neu
    | "offer_create"        // 2 Angebot erstellen
    | "await_payment"       // 3 Warten auf Zahlung
    | "paid_not_started"    // bezahlt, aber noch nicht in Vorbereitung
    | "packaging"           // 4 In Vorbereitung
    | "shipping"            // 5A Versand
    | "pickup"              // 5B Abholung
    | "completed"           // 6 Abgeschlossen
    | "clarify";            // Klärfälle

export const RX_QUEUE_TABS: { value: RxQueue | "all"; label: string }[] = [
    { value: "inbox", label: "Eingang / Neu" },
    { value: "offer_create", label: "Angebot erstellen" },
    { value: "await_payment", label: "Warten auf Zahlung" },
    { value: "paid_not_started", label: "Bezahlt (neu)" },
    { value: "packaging", label: "In Vorbereitung" },
    { value: "shipping", label: "Versand" },
    { value: "pickup", label: "Abholung" },
    { value: "completed", label: "Abgeschlossen" },
    { value: "clarify", label: "Klärfälle" },
];