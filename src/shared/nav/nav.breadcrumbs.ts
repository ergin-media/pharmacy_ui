import type { NavItem } from "@/shared/nav/nav.types";
import { NAV_SECTIONS } from "@/shared/nav/nav.config";

export type BreadcrumbCrumb = {
    title: string;
    to: string;
};

function flattenNav(items: NavItem[]): NavItem[] {
    const out: NavItem[] = [];
    for (const it of items) {
        out.push(it);
        if (it.items?.length) out.push(...flattenNav(it.items));
    }
    return out;
}

function isPathMatch(pathname: string, to: string) {
    if (pathname === to) return true;
    if (to !== "/" && pathname.startsWith(to + "/")) return true;
    return false;
}

export function getBreadcrumbsForPath(pathname: string): BreadcrumbCrumb[] {
    const all = flattenNav(NAV_SECTIONS);

    // exakter Treffer
    const exact = all.find((i) => i.to === pathname);
    if (exact) {
        // Parent via Prefix-Suche (optional)
        const parents = all
            .filter((i) => i.to !== exact.to && isPathMatch(pathname, i.to))
            .sort((a, b) => a.to.length - b.to.length);

        const chain = [...parents, exact]
            // dedupe by "to"
            .filter(
                (x, idx, arr) => arr.findIndex((y) => y.to === x.to) === idx,
            );

        return chain.map((x) => ({ title: x.title, to: x.to }));
    }

    // sonst: längster Prefix gewinnt
    const best = all
        .filter((i) => isPathMatch(pathname, i.to))
        .sort((a, b) => b.to.length - a.to.length)[0];

    return best ? [{ title: best.title, to: best.to }] : [];
}
