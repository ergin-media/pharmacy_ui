import type { NavItem } from "./nav.types";
import {
    LayoutDashboard,
    FileText,
    Receipt,
    ShoppingCart,
    Package,
    Pill,
    Users,
    Truck,
    Settings,
    ShieldCheck,
} from "lucide-react";

/**
 * App-weite Navigation (keine Feature-Imports).
 * Feature-spezifische Routen bleiben in /features/...; hier nur "to"-Strings.
 */
export const NAV_SECTIONS: NavItem[] = [
    {
        id: "dashboard",
        title: "Dashboard",
        to: "/",
        icon: LayoutDashboard,
    },

    {
        id: "rx",
        title: "Rezepte",
        to: "/rx",
        icon: FileText,
        /*
        items: [
            { id: "rx-list", title: "Übersicht", to: "/rx" },
            { id: "rx-workflow", title: "Workflow", to: "/rx/workflow" },
            { id: "rx-invoices", title: "Rechnungen", to: "/rx/invoices" },
        ],
        */
    },
    /*
    {
        id: "orders",
        title: "Bestellungen",
        to: "/orders",
        icon: ShoppingCart,
        items: [
            { id: "orders-list", title: "Übersicht", to: "/orders" },
            { id: "orders-shipping", title: "Versand", to: "/orders/shipping" },
            { id: "orders-pickup", title: "Abholung", to: "/orders/pickup" },
        ],
    },
    */
    {
        id: "products",
        title: "Produkte",
        to: "/products",
        icon: Package,
        items: [
            { id: "products-catalog", title: "Katalog", to: "/products" },
            {
                id: "products-mapping",
                title: "Mappings",
                to: "/products/mappings",
            },
        ],
    },

    {
        id: "patients",
        title: "Patienten",
        to: "/patients",
        icon: Users,
        /*
        items: [
            { id: "patients-list", title: "Übersicht", to: "/patients" },
            {
                id: "patients-requests",
                title: "Anfragen",
                to: "/patients/requests",
            },
        ],
        */
    },

    /*
    {
        id: "pharmacy",
        title: "Apotheke",
        to: "/pharmacy",
        icon: Pill,
        items: [
            {
                id: "pharmacy-receipts",
                title: "Rezepteingang",
                to: "/pharmacy/receipts",
            },
            {
                id: "pharmacy-shipping",
                title: "Versandlabels",
                to: "/pharmacy/labels",
            },
            {
                id: "pharmacy-invoices",
                title: "Rechnungen",
                to: "/pharmacy/invoices",
            },
        ],
    },

    {
        id: "shipping",
        title: "Versand",
        to: "/shipping",
        icon: Truck,
        items: [
            {
                id: "shipping-carriers",
                title: "Dienstleister",
                to: "/shipping/carriers",
            },
            { id: "shipping-rules", title: "Regeln", to: "/shipping/rules" },
        ],
    },

    {
        id: "billing",
        title: "Abrechnung",
        to: "/billing",
        icon: Receipt,
        items: [
            { id: "billing-overview", title: "Übersicht", to: "/billing" },
            {
                id: "billing-payouts",
                title: "Auszahlungen",
                to: "/billing/payouts",
            },
        ],
    },

    {
        id: "admin",
        title: "Admin",
        to: "/admin",
        icon: ShieldCheck,
        items: [
            { id: "admin-users", title: "Benutzer", to: "/admin/users" },
            { id: "admin-roles", title: "Rollen & Rechte", to: "/admin/roles" },
        ],
    },
    */

    {
        id: "settings",
        title: "Einstellungen",
        to: "/settings",
        icon: Settings,
        items: [
            { id: "settings-general", title: "Allgemein", to: "/settings" },
            {
                id: "settings-integrations",
                title: "Integrationen",
                to: "/settings/integrations",
            },
        ],
    },
];

// Optional: “Projects/Shortcuts”-Bereich (wie im shadcn Beispiel)
export const NAV_PROJECTS: Array<
    Pick<NavItem, "id" | "title" | "to" | "icon">
> = [
    { id: "rx", title: "RX", to: "/rx", icon: FileText },
    { id: "products", title: "Produkte", to: "/products", icon: Package },
    { id: "billing", title: "Abrechnung", to: "/billing", icon: Receipt },
];
