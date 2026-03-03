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
        variant: "secondary",
    },
    packaging: {
        label: "In Vorbereitung",
        icon: Package,
        variant: "secondary",
    },
    shipping: {
        label: "Versand",
        icon: Truck,
        variant: "secondary",
    },
    pickup: {
        label: "Abholung",
        icon: Store,
        variant: "secondary",
    },
    completed: {
        label: "Abgeschlossen",
        icon: CheckCircle2,
        variant: "secondary",
    },
    clarify: {
        label: "Klärfälle",
        icon: AlertTriangle,
        variant: "destructive",
    },
} as const;

export type RxQueue = keyof typeof RX_QUEUES;
