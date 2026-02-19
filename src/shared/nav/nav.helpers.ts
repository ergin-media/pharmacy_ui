import { NAV_SECTIONS } from "./nav.config";
import type { NavItem } from "./nav.types";

export function isNavActive(item: NavItem, pathname: string): boolean {
    if (pathname === item.to) return true;
    if (!item.items?.length) return false;
    return item.items.some((child) => pathname === child.to);
}

function isPathMatch(pathname: string, to: string) {
    if (pathname === to) return true;
    if (to !== "/" && pathname.startsWith(to + "/")) return true;
    return false;
}

function flattenNav(items: NavItem[]): NavItem[] {
    const out: NavItem[] = [];
    for (const it of items) {
        out.push(it);
        if (it.items?.length) out.push(...flattenNav(it.items));
    }
    return out;
}

export function getTitleForPath(pathname: string): string {
    const all = flattenNav(NAV_SECTIONS);

    // 1) Exakter Treffer gewinnt immer
    const exact = all.find((i) => i.to === pathname);
    if (exact) return exact.title;

    // 2) Sonst: längster Prefix gewinnt (spezifischste Route)
    const best = all
        .filter((i) => isPathMatch(pathname, i.to))
        .sort((a, b) => b.to.length - a.to.length)[0];

    return best?.title ?? "Dashboard";
}
