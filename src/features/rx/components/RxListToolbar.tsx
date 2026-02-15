import type {
    RxParseStatus,
    RxWorkflowStatus,
    RxPaymentState,
} from "../types/rx.dto";
import {
    PER_PAGE_OPTIONS,
    SORT_OPTIONS,
    WORKFLOW_OPTIONS,
    PAYMENT_OPTIONS,
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

    workflowStatus?: RxWorkflowStatus; // neu
    paymentState?: RxPaymentState; // neu

    providerRaw: string; // slug oder ""
    searchRaw: string;
    sort: RxSort;
    perPage: number;

    isFetching: boolean;

    onParseStatusChange: (v: string) => void;

    onWorkflowStatusChange: (v: string) => void; // neu: v oder ""
    onPaymentStateChange: (v: string) => void; // neu: v oder ""

    onProviderChange: (v: string) => void; // slug oder ""
    onSearchChange: (v: string) => void;
    onSortChange: (v: string) => void;
    onPerPageChange: (v: number) => void;
    onRefresh: () => void;
}) {
    const {
        parseStatus,
        workflowStatus,
        paymentState,
        providerRaw,
        searchRaw,
        sort,
        perPage,
        isFetching,
        onParseStatusChange,
        onWorkflowStatusChange,
        onPaymentStateChange,
        onProviderChange,
        onSearchChange,
        onSortChange,
        onPerPageChange,
        onRefresh,
    } = props;

    // Selects + Button deaktivieren, Inputs aktiv lassen
    const disableControls = isFetching;

    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* Parse Status */}
            <Select
                value={parseStatus ?? "all"}
                onValueChange={onParseStatusChange}
                disabled={disableControls}
            >
                <SelectTrigger className="w-55">
                    <SelectValue placeholder="Parse-Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Alle Parse-Status</SelectItem>
                    <SelectItem value="pending">pending</SelectItem>
                    <SelectItem value="parsed">parsed</SelectItem>
                    <SelectItem value="failed">failed</SelectItem>
                    <SelectItem value="parsed_with_warnings">
                        parsed_with_warnings
                    </SelectItem>
                </SelectContent>
            </Select>

            {/* Workflow Status */}
            <Select
                value={workflowStatus ?? "all"}
                onValueChange={(v) =>
                    onWorkflowStatusChange(v === "all" ? "" : v)
                }
                disabled={disableControls}
            >
                <SelectTrigger className="w-55">
                    <SelectValue placeholder="Workflow" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Alle Workflows</SelectItem>
                    {WORKFLOW_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                            {o.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Payment State */}
            <Select
                value={paymentState ?? "all"}
                onValueChange={(v) =>
                    onPaymentStateChange(v === "all" ? "" : v)
                }
                disabled={disableControls}
            >
                <SelectTrigger className="w-55">
                    <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Alle Payments</SelectItem>
                    {PAYMENT_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                            {o.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Provider */}
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

            {/* Suche bleibt Input */}
            <Input
                value={searchRaw}
                placeholder="Suche (Patient, Bestell-ID)"
                className="w-80"
                onChange={(e) => onSearchChange(e.target.value)}
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

            {/* Refresh */}
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
