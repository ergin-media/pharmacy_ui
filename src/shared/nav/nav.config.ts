export type NavItem = {
    label: string;
    to: string;
};

export type NavSection = {
    title: string;
    items: NavItem[];
};

export const NAV_SECTIONS: NavSection[] = [
    {
        title: "Rezepte",
        items: [{ label: "RX Übersicht", to: "/rx" }],
    },

    // später:
    // { title: "Patienten", items: [{ label: "Patienten", to: "/patients" }] },
    // { title: "Stammdaten", items: [{ label: "Provider", to: "/providers" }] },
    // { title: "System", items: [{ label: "Jobs & Logs", to: "/system/jobs" }] },
];
