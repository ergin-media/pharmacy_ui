import { Inbox, FileText, Clock, BadgeCheck, Package, Truck, Store, CheckCircle2, AlertTriangle } from "lucide-react";

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

export const RX_QUEUE_TABS: {
    value: RxQueue;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}[] = [
        { value: "inbox", label: "Eingang / Neu", icon: Inbox },
        { value: "offer_create", label: "Angebot erstellen", icon: FileText },
        { value: "await_payment", label: "Warten auf Zahlung", icon: Clock },
        { value: "paid_not_started", label: "Bezahlt (neu)", icon: BadgeCheck },
        { value: "packaging", label: "In Vorbereitung", icon: Package },
        { value: "shipping", label: "Versand", icon: Truck },
        { value: "pickup", label: "Abholung", icon: Store },
        { value: "completed", label: "Abgeschlossen", icon: CheckCircle2 },
        { value: "clarify", label: "Klärfälle", icon: AlertTriangle },
    ];