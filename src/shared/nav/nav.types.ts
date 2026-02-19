import type { LucideIcon } from "lucide-react";

export type NavItem = {
    id: string;
    title: string;
    to: string; // react-router path
    icon?: LucideIcon;

    // optional
    description?: string;
    items?: NavItem[]; // subitems
    disabled?: boolean;
    badge?: string | number;
};
