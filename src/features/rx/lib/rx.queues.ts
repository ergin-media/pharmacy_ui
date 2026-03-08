import {
    Layers,
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
    all: {
        label: "Alle",
        icon: Layers,
        variant: "neutral",
    },
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

export const RX_QUEUE_ORDER: RxQueue[] = [
    "all",
    "inbox",
    "offer_create",
    "await_payment",
    "paid_not_started",
    "packaging",
    "shipping",
    "pickup",
    "completed",
    "clarify",
];

export const RX_QUEUE_ITEMS = RX_QUEUE_ORDER.map((value) => ({
    value,
    ...RX_QUEUES[value],
}));

export type RxQueueCounts = Partial<Record<RxQueue, number>>;