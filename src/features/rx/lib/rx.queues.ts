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
        visible: true,
    },
    inbox: {
        label: "Neu",
        icon: Inbox,
        variant: "neutral",
        visible: true,
    },
    offer_create: {
        label: "Angebot erstellen",
        icon: FileText,
        variant: "neutral",
        visible: true,
    },
    await_payment: {
        label: "Warten auf Zahlung",
        icon: Clock,
        variant: "neutral",
        visible: true,
    },
    paid_not_started: {
        label: "Bezahlt",
        icon: BadgeCheck,
        variant: "neutral",
        visible: true,
    },
    packaging: {
        label: "In Vorbereitung",
        icon: Package,
        variant: "neutral",
        visible: true,
    },
    shipping: {
        label: "Versand",
        icon: Truck,
        variant: "neutral",
        visible: true,
    },
    pickup: {
        label: "Abholung",
        icon: Store,
        variant: "neutral",
        visible: true,
    },
    completed: {
        label: "Abgeschlossen",
        icon: CheckCircle2,
        variant: "neutral",
        visible: true,
    },
    clarify: {
        label: "Klärfälle",
        icon: AlertTriangle,
        variant: "destructive",
        visible: true,
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

export const RX_QUEUE_ITEMS_VISIBLE = RX_QUEUE_ITEMS.filter(
    (item) => item.visible !== false,
);

export type RxQueueCounts = Partial<Record<RxQueue, number>>;
