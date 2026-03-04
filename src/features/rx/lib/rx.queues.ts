// src/features/rx/lib/rx.queues.ts
import {
    Inbox,
    FileText,
    Clock,
    BadgeCheck,
    Package,
    Truck,
    Store,
    CheckCircle2,
    AlertTriangle,
} from "lucide-react";

export const RX_QUEUES = {
    inbox: {
        label: "Neu",
        icon: Inbox,
        variant: "neutral",
    },
    offer_create: {
        label: "Angebot erstellen",
        icon: FileText,
        variant: "neutral",
    },
    await_payment: {
        label: "Warten auf Zahlung",
        icon: Clock,
        variant: "neutral",
    },
    paid_not_started: {
        label: "Bezahlt",
        icon: BadgeCheck,
        variant: "neutral",
    },
    packaging: {
        label: "In Vorbereitung",
        icon: Package,
        variant: "neutral",
    },
    shipping: {
        label: "Versand",
        icon: Truck,
        variant: "neutral",
    },
    pickup: {
        label: "Abholung",
        icon: Store,
        variant: "neutral",
    },
    completed: {
        label: "Abgeschlossen",
        icon: CheckCircle2,
        variant: "neutral",
    },
    clarify: {
        label: "Klärfälle",
        icon: AlertTriangle,
        variant: "destructive",
    },
} as const;

export type RxQueue = keyof typeof RX_QUEUES;
