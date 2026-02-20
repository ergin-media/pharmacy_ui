import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ACTIVE_FILTERS } from "../lib/pharmacy-products.constants";
import type { PharmacyProductsSort } from "../types/pharmacy-products.dto";

export function PharmacyProductsToolbar(props: {
    activeRaw: string;
    sort: PharmacyProductsSort;
    searchRaw: string;
    isFetching: boolean;

    onActiveChange: (v: string) => void;
    onSortChange: (v: string) => void;
    onSearchChange: (v: string) => void;
    onRefresh: () => void;
}) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <select
                className="h-9 rounded-md border bg-background px-2 text-sm"
                value={props.activeRaw}
                onChange={(e) => props.onActiveChange(e.target.value)}
            >
                {ACTIVE_FILTERS.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>

            <select
                className="h-9 rounded-md border bg-background px-2 text-sm"
                value={props.sort}
                onChange={(e) => props.onSortChange(e.target.value)}
            >
                <option value="created_at_desc">Neueste zuerst</option>
                <option value="created_at_asc">Älteste zuerst</option>
                <option value="name_asc">Name A–Z</option>
                <option value="name_desc">Name Z–A</option>
                <option value="price_asc">Preis aufsteigend</option>
                <option value="price_desc">Preis absteigend</option>
            </select>

            <Input
                value={props.searchRaw}
                onChange={(e) => props.onSearchChange(e.target.value)}
                placeholder="Suche (Name / Code / Hersteller)…"
                className="h-9 w-[280px] max-w-full"
            />

            <Button
                variant="outline"
                size="sm"
                onClick={props.onRefresh}
                disabled={props.isFetching}
            >
                Aktualisieren
            </Button>
        </div>
    );
}
