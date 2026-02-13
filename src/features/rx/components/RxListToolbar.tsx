import type { RxParseStatus } from "../types/rx.dto";
import {
    PER_PAGE_OPTIONS,
    SORT_OPTIONS,
    type RxSort,
} from "../lib/rx.constants";

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
    providerRaw: string;
    searchRaw: string;
    sort: RxSort;
    perPage: number;

    isFetching: boolean;

    onParseStatusChange: (v: string) => void;
    onProviderChange: (v: string) => void;
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

    // Während Fetch: alle Controls deaktivieren
    const disabled = isFetching;

    return (
        <div className="flex gap-2 flex-wrap items-center">
            <Select
                value={parseStatus ?? "all"}
                onValueChange={onParseStatusChange}
                disabled={disabled}
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

            <Input
                value={providerRaw}
                placeholder="Provider-Slug (optional)"
                className="w-60"
                onChange={(e) => onProviderChange(e.target.value)}
                disabled={disabled}
            />

            <Input
                value={searchRaw}
                placeholder="Suche (Artikel, Patient, E-Mail, Hash …)"
                className="w-80"
                onChange={(e) => onSearchChange(e.target.value)}
                disabled={disabled}
            />

            <Select
                value={sort}
                onValueChange={onSortChange}
                disabled={disabled}
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
                disabled={disabled}
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

            <Button variant="outline" onClick={onRefresh} disabled={disabled}>
                {isFetching ? "Aktualisiere…" : "Aktualisieren"}
            </Button>
        </div>
    );
}
