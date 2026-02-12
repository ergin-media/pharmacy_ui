import { NAV_SECTIONS } from "./nav.config";

export function getTitleForPath(pathname: string): string {
    for (const section of NAV_SECTIONS) {
        for (const item of section.items) {
            if (item.to === pathname) return item.label;
        }
    }
    return "Dashboard";
}
