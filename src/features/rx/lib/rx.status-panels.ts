export const RX_STATUS_PANELS = {
    all: {
        label: "Alle",
    },
    new: {
        label: "Neue Verordnung",
    },
    processing: {
        label: "In Bearbeitung",
    },
    completed: {
        label: "Abgeschlossen",
    },
    attention: {
        label: "Handlungsbedarf",
    },
} as const;

export type RxStatusPanel = keyof typeof RX_STATUS_PANELS;

export const RX_STATUS_PANEL_ORDER: RxStatusPanel[] = [
    "all",
    "new",
    "processing",
    "completed",
    "attention",
];

export const RX_STATUS_PANEL_ITEMS = RX_STATUS_PANEL_ORDER.map((value) => ({
    value,
    ...RX_STATUS_PANELS[value],
}));

export type RxStatusCounts = Partial<
    Record<Exclude<RxStatusPanel, "all" | "attention">, number>
>;
