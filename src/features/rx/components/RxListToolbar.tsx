import type {
    RxParseStatus,
    RxWorkflowStatus,
    RxPaymentState,
} from "../types/rx.dto";
import { PER_PAGE_OPTIONS, type RxSort } from "../lib/rx.constants";
import { RX_PROVIDERS } from "../lib/rx.providers";

import { formatInt } from "@/shared/lib/format/figures";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Pagination } from "@/components/ui/pagination";

export function RxListToolbar(props: {
    total: number;
    page: number;
    totalPages: number;

    parseStatus?: RxParseStatus;
    workflowStatus?: RxWorkflowStatus;
    paymentState?: RxPaymentState;

    providerRaw: string;
    searchRaw: string;
    sort: RxSort;
    perPage: number;

    isFetching: boolean;

    onPageChange: (page: number) => void;
    onParseStatusChange: (v: string) => void;
    onWorkflowStatusChange: (v: string) => void;
    onPaymentStateChange: (v: string) => void;
    onProviderChange: (v: string) => void;
    onSearchChange: (v: string) => void;
    onSortChange: (v: string) => void;
    onPerPageChange: (v: number) => void;
    onRefresh: () => void;
}) {
    const {
        total,
        page,
        totalPages,
        providerRaw,
        searchRaw,
        perPage,
        isFetching,
        onPageChange,
        onProviderChange,
        onSearchChange,
        onPerPageChange,
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
                placeholder="Suche (Patient, Bestell-ID)"
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
                <SelectTrigger className="w-40">
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
                    showStatus={true}
                />
            </div>
        </div>
    );
}
