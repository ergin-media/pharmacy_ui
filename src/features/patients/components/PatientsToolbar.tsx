import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import type { PatientsIssues, PatientsSort } from "../types/patients.list.dto";
import { ISSUES_FILTER_OPTIONS } from "../lib/patients.constants";
import { RotateCcw } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const SORT_OPTIONS: Array<{ value: PatientsSort; label: string }> = [
    { value: "created_at_desc", label: "Neueste zuerst" },
    { value: "created_at_asc", label: "Älteste zuerst" },
    { value: "last_name_asc", label: "Nachname A–Z" },
    { value: "last_name_desc", label: "Nachname Z–A" },
];

export function PatientsToolbar(props: {
    searchRaw: string;
    sort: PatientsSort;
    issues: PatientsIssues;
    perPage: number;
    isFetching?: boolean;

    onSearchChange: (v: string) => void;
    onSortChange: (v: PatientsSort) => void;
    onIssuesChange: (v: PatientsIssues) => void;
    onPerPageChange: (v: number) => void;
    onRefresh: () => void;
}) {
    const {
        searchRaw,
        sort,
        issues,
        perPage,
        isFetching,
        onSearchChange,
        onSortChange,
        onIssuesChange,
        onPerPageChange,
        onRefresh,
    } = props;

    return (
        <div className="flex flex-wrap items-center gap-4 flex-1">
            <Input
                value={searchRaw}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Suche nach Name, E-Mail, Telefon…"
                className="flex-1"
                disabled={isFetching}
            />

            <Separator orientation="vertical" className="h-4" />

            <Select
                value={issues}
                onValueChange={(v) => onIssuesChange(v as PatientsIssues)}
            >
                <SelectTrigger className="w-40" disabled={isFetching}>
                    <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                    {ISSUES_FILTER_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                            {o.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Separator orientation="vertical" className="h-4" />

            <Select
                value={sort}
                onValueChange={(v) => onSortChange(v as PatientsSort)}
            >
                <SelectTrigger className="w-40" disabled={isFetching}>
                    <SelectValue placeholder="Sortierung" />
                </SelectTrigger>
                <SelectContent>
                    {SORT_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                            {o.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Separator orientation="vertical" className="h-4" />

            <Select
                value={String(perPage)}
                onValueChange={(v) => onPerPageChange(Number(v))}
            >
                <SelectTrigger className="w-28" disabled={isFetching}>
                    <SelectValue placeholder="Pro Seite" />
                </SelectTrigger>
                <SelectContent>
                    {[10, 20, 50, 100].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                            {n} / Seite
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/*
            <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isFetching}
                className="gap-2"
            >
                <RotateCcw className="size-4" />
                Aktualisieren
            </Button>
            */}
        </div>
    );
}
