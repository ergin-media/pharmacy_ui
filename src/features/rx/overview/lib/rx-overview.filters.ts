import type { RxListItemDto } from "../../types/rx.dto";
import { getRxOverviewStatus, type RxOverviewStatus } from "./rx-overview.status";

export type RxOverviewFilters = {
    search?: string;
    status?: RxOverviewStatus | "open";
    onlyAttention?: boolean;
};

export function rxMatchesOverviewFilters(
    rx: RxListItemDto,
    filters: RxOverviewFilters,
): boolean {
    const status = getRxOverviewStatus(rx);

    // 🔴 Nur Handlungsbedarf
    if (filters.onlyAttention && status !== "attention") {
        return false;
    }

    // 📊 Status Filter
    if (filters.status) {
        if (filters.status === "open") {
            if (status === "completed") return false;
        } else if (status !== filters.status) {
            return false;
        }
    }

    // 🔎 Suche
    if (filters.search) {
        const q = filters.search.toLowerCase();

        const haystack = [
            rx.patient?.first_name,
            rx.patient?.last_name,
            rx.mail?.subject,
            ...rx.items.map((i) => i.raw_product_name),
        ]
            .join(" ")
            .toLowerCase();

        if (!haystack.includes(q)) {
            return false;
        }
    }

    return true;
}