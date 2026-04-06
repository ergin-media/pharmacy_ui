import { formatInt } from "@/shared/lib/format/figures";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { PER_PAGE_OPTIONS } from "../../lib/rx.constants";
import { RX_PROVIDERS } from "../../lib/rx.providers";
import type { RxOverviewStatus } from "../lib/rx-overview.status";

export function RxOverviewToolbar(props: {
    total: number;
    page: number;
    totalPages: number;
    providerRaw: string;
    searchRaw: string;
    perPage: number;
    status?: RxOverviewStatus | "open";
    onlyAttention: boolean;
    isFetching: boolean;
    onPageChange: (page: number) => void;
    onProviderChange: (value: string) => void;
    onSearchChange: (value: string) => void;
    onPerPageChange: (value: number) => void;
    onStatusChange: (value?: RxOverviewStatus | "open") => void;
    onOnlyAttentionChange: (value: boolean) => void;
}) {
    const {
        total,
        page,
        totalPages,
        providerRaw,
        searchRaw,
        perPage,
        status,
        onlyAttention,
        isFetching,
        onPageChange,
        onProviderChange,
        onSearchChange,
        onPerPageChange,
        onStatusChange,
        onOnlyAttentionChange,
    } = props;

    const disableControls = isFetching;

    return (
        <div className="flex flex-1 flex-wrap items-center gap-4">
            <div className="whitespace-nowrap text-sm text-muted-foreground">
                Gesamt:{" "}
                <span className="font-medium text-foreground">
                    {formatInt(total)}
                </span>
            </div>

            <Separator orientation="vertical" className="h-4" />

            <Input
                value={searchRaw}
                placeholder="Suche (Patient, E-Mail, Artikel)"
                className="w-80 flex-1"
                onChange={(e) => onSearchChange(e.target.value)}
                disabled={disableControls}
            />

            <Separator orientation="vertical" className="h-4" />

            <Select
                value={providerRaw || "all"}
                onValueChange={(v) => onProviderChange(v === "all" ? "" : v)}
                disabled={disableControls}
            >
                <SelectTrigger className="w-44">
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

            <Select
                value={status ?? "all"}
                onValueChange={(v) =>
                    onStatusChange(v === "all" ? undefined : (v as RxOverviewStatus | "open"))
                }
                disabled={disableControls}
            >
                <SelectTrigger className="w-52">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Alle Status</SelectItem>
                    <SelectItem value="open">Offen</SelectItem>
                    <SelectItem value="offer_required">
                        Angebot erstellen
                    </SelectItem>
                    <SelectItem value="awaiting_payment">
                        Warten auf Zahlung
                    </SelectItem>
                    <SelectItem value="paid">Bezahlt</SelectItem>
                    <SelectItem value="in_progress">
                        In Bearbeitung
                    </SelectItem>
                    <SelectItem value="ready">Bereit</SelectItem>
                    <SelectItem value="completed">Abgeschlossen</SelectItem>
                </SelectContent>
            </Select>

            <Button
                type="button"
                variant={onlyAttention ? "destructive" : "outline"}
                size="sm"
                disabled={disableControls}
                onClick={() => onOnlyAttentionChange(!onlyAttention)}
            >
                Handlungsbedarf
            </Button>

            <div className="ml-auto flex items-center gap-4">
                <Separator orientation="vertical" className="h-4" />

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

                <Separator orientation="vertical" className="h-4" />

                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    isLoading={isFetching}
                    showStatus
                />
            </div>
        </div>
    );
}