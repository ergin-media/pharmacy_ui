import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ACTIVE_FILTERS,
    PER_PAGE_OPTIONS,
    SORT_OPTIONS,
} from "../lib/pharmacy-products.constants.ts";

export function PharmacyProductsToolbar(props: {
    activeRaw: string;
    manufacturerRaw: string;
    searchRaw: string;
    sort: string;
    perPage: number;
    isFetching: boolean;

    onActiveChange: (v: string) => void;
    onManufacturerChange: (v: string) => void;
    onSearchChange: (v: string) => void;
    onSortChange: (v: string) => void;
    onPerPageChange: (v: number) => void;
    onRefresh: () => void;
}) {
    const {
        activeRaw,
        manufacturerRaw,
        searchRaw,
        sort,
        perPage,
        isFetching,
        onActiveChange,
        onManufacturerChange,
        onSearchChange,
        onSortChange,
        onPerPageChange,
        onRefresh,
    } = props;

    const disableControls = isFetching;

    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* Active */}
            <Select
                value={activeRaw ?? ""}
                onValueChange={onActiveChange}
                disabled={disableControls}
            >
                <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Alle Produkte</SelectItem>
                    {ACTIVE_FILTERS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                            {o.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Manufacturer (simple input for now) */}
            <Input
                value={manufacturerRaw}
                onChange={(e) => onManufacturerChange(e.target.value)}
                placeholder="Hersteller…"
                className="w-50"
            />

            {/* Search */}
            <Input
                value={searchRaw}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Suche (Name / Code)…"
                className="w-60"
            />

            {/* Sort */}
            <Select
                value={sort}
                onValueChange={onSortChange}
                disabled={disableControls}
            >
                <SelectTrigger className="w-56">
                    <SelectValue placeholder="Sortierung" />
                </SelectTrigger>
                <SelectContent>
                    {SORT_OPTIONS.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                            {s.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Per Page */}
            <Select
                value={String(perPage)}
                onValueChange={(v) => onPerPageChange(Number(v))}
                disabled={disableControls}
            >
                <SelectTrigger className="w-40">
                    <SelectValue placeholder="Pro Seite" />
                </SelectTrigger>
                <SelectContent>
                    {PER_PAGE_OPTIONS.map((n) => (
                        <SelectItem key={n} value={String(n)}>
                            {n} / Seite
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Button
                variant="outline"
                onClick={onRefresh}
                disabled={disableControls}
            >
                Aktualisieren
            </Button>
        </div>
    );
}
