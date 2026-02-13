import type { RxParseStatus } from "../types/rx.dto";
import {
    PER_PAGE_OPTIONS,
    SORT_OPTIONS,
    type RxSort,
} from "../lib/rx.constants";
import { RX_PROVIDERS } from "../lib/rx.providers";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function RxListToolbar(props: {
    parseStatus?: RxParseStatus;

    providerRaw: string; // wird jetzt slug oder "" sein
    searchRaw: string;
    sort: RxSort;
    perPage: number;

    isFetching: boolean;

    onParseStatusChange: (v: string) => void;
    onProviderChange: (v: string) => void; // v ist slug oder ""
    onSearchChange: (v: string) => void;
    onSortChange: (v: string) => void;
    onPerPageChange: (v: number) => void;
    onRefresh: () => void;
}) {
    const {
        parseStatus,
        providerRaw,
        searchRaw,
        sort,
        perPage,
        isFetching,
        onParseStatusChange,
        onProviderChange,
        onSearchChange,
        onSortChange,
        onPerPageChange,
        onRefresh,
    } = props;

    // Selects + Button deaktivieren, Inputs aktiv lassen (Tippen nicht beeinflussen)
    const disableControls = isFetching;

    return (
        <div className="flex flex-wrap items-center gap-2">
            <Select
                value={parseStatus ?? "all"}
                onValueChange={onParseStatusChange}
                disabled={disableControls}
            >
                <SelectTrigger className="w-55">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Alle Status</SelectItem>
                    <SelectItem value="pending">pending</SelectItem>
                    <SelectItem value="parsed">parsed</SelectItem>
                    <SelectItem value="failed">failed</SelectItem>
                    <SelectItem value="parsed_with_warnings">
                        parsed_with_warnings
                    </SelectItem>
                </SelectContent>
            </Select>

            {/* Provider als Select */}
            <Select
                value={providerRaw || "all"}
                onValueChange={(v) => onProviderChange(v === "all" ? "" : v)}
                disabled={disableControls}
            >
                <SelectTrigger className="w-55">
                    <SelectValue placeholder="Provider" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Alle Plattformen</SelectItem>
                    {RX_PROVIDERS.map((p) => (
                        <SelectItem key={p.slug} value={p.slug}>
                            {p.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Suche bleibt Input (nicht disabled) */}
            <Input
                value={searchRaw}
                placeholder="Suche (Artikel, Patient, E-Mail, Hash …)"
                className="w-80"
                onChange={(e) => onSearchChange(e.target.value)}
            />

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
                {isFetching ? "Aktualisiere…" : "Aktualisieren"}
            </Button>
        </div>
    );
}
