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
} as const;

export type RxStatusPanel = keyof typeof RX_STATUS_PANELS;

export const RX_STATUS_PANEL_ORDER: RxStatusPanel[] = [
    "all",
    "new",
    "processing",
    "completed",
];

export const RX_STATUS_PANEL_ITEMS = RX_STATUS_PANEL_ORDER.map((value) => ({
    value,
    ...RX_STATUS_PANELS[value],
}));

export type RxStatusCounts = Partial<
    Record<Exclude<RxStatusPanel, "all">, number>
>;
