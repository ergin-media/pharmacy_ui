import { NAV_SECTIONS } from "./nav.config";
import type { NavItem } from "./nav.types";

export function isNavActive(item: NavItem, pathname: string): boolean {
    if (pathname === item.to) return true;
    if (!item.items?.length) return false;
    return item.items.some((child) => pathname === child.to);
}

export function getTitleForPath(pathname: string): string {
    for (const item of NAV_SECTIONS) {
        if (item.to === pathname) return item.title;
    }
    return "Dashboard";
}
