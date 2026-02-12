import { useSearchParams } from "react-router";
import { useRxListQuery } from "../queries/rx.queries";
import type { RxParseStatus } from "../types/rx.dto";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const PER_PAGE_OPTIONS = [10, 25, 50, 100] as const;
const SORT_OPTIONS = [
    { value: "created_at_desc", label: "Neueste zuerst" },
    { value: "created_at_asc", label: "Älteste zuerst" },
    { value: "received_at_desc", label: "Eingang: neueste zuerst" },
    { value: "received_at_asc", label: "Eingang: älteste zuerst" },
] as const;

type RxSort = (typeof SORT_OPTIONS)[number]["value"];

const DEFAULT_SORT: RxSort = "created_at_desc";
const ALLOWED_SORTS = SORT_OPTIONS.map((s) => s.value) as RxSort[];

function toInt(value: string | null, fallback: number) {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function formatDate(value?: string | null) {
    if (!value) return "-";
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
}

const ALLOWED_STATUSES: RxParseStatus[] = [
    "pending",
    "parsed",
    "failed",
    "parsed_with_warnings",
];

function badgeVariant(status: RxParseStatus) {
    switch (status) {
        case "parsed":
            return "secondary";
        case "failed":
            return "destructive";
        case "parsed_with_warnings":
            return "outline";
        default:
            return "outline";
    }
}

export function RxListPage() {
    const [sp, setSp] = useSearchParams();

    const page = Math.max(1, toInt(sp.get("page"), 1));
    const perPage = Math.max(1, Math.min(100, toInt(sp.get("per_page"), 25)));

    const parseStatusRaw = (sp.get("parse_status") ?? "").trim();
    const parseStatus = (ALLOWED_STATUSES as string[]).includes(parseStatusRaw)
        ? (parseStatusRaw as RxParseStatus)
        : undefined;

    const providerRaw = (sp.get("provider") ?? "").trim();
    const provider = providerRaw ? providerRaw : undefined;
    const searchRaw = (sp.get("search") ?? "").trim();
    const search = searchRaw ? searchRaw : undefined;

    const sortRaw = (sp.get("sort") ?? "").trim();
    const sort = (ALLOWED_SORTS as readonly string[]).includes(sortRaw)
        ? (sortRaw as RxSort)
        : DEFAULT_SORT;

    const params = {
        page,
        per_page: perPage,
        parse_status: parseStatus,
        provider,
        search,
        sort,
    };

    const q = useRxListQuery(params);
    const total = q.data?.total ?? 0;
    const totalPages = q.data?.total_pages ?? 1;

    function updateParams(
        next: Partial<{
            page: number;
            per_page: number;
            parse_status: string;
            provider: string;
            search: string;
            sort: string;
        }>,
    ) {
        const n = new URLSearchParams(sp);

        if (next.page !== undefined) n.set("page", String(next.page));
        if (next.per_page !== undefined)
            n.set("per_page", String(next.per_page));

        if (next.parse_status !== undefined) {
            if (next.parse_status) n.set("parse_status", next.parse_status);
            else n.delete("parse_status");
        }

        if (next.provider !== undefined) {
            const v = next.provider.trim();
            if (v) n.set("provider", v);
            else n.delete("provider");
        }

        // neu: search
        if (next.search !== undefined) {
            const v = next.search.trim();
            if (v) n.set("search", v);
            else n.delete("search");
        }

        // neu: sort
        if (next.sort !== undefined) {
            const v = next.sort.trim();
            if (v) n.set("sort", v);
            else n.delete("sort");
        }

        setSp(n, { replace: true });
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>RX</CardTitle>

                <div className="flex gap-2 flex-wrap items-center">
                    <Select
                        value={parseStatus ?? "all"}
                        onValueChange={(v) =>
                            updateParams({
                                page: 1,
                                parse_status: v === "all" ? "" : v,
                            })
                        }
                    >
                        <SelectTrigger className="w-[220px]">
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
                        onChange={(e) =>
                            updateParams({
                                page: 1,
                                provider: e.target.value,
                            })
                        }
                    />

                    <Input
                        value={searchRaw}
                        placeholder="Suche (Betreff, E-Mail, Patient, Hash …)"
                        className="w-80"
                        onChange={(e) =>
                            updateParams({
                                page: 1,
                                search: e.target.value,
                            })
                        }
                    />

                    <Select
                        value={sort}
                        onValueChange={(v) =>
                            updateParams({
                                page: 1,
                                sort: v,
                            })
                        }
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
                        onValueChange={(v) =>
                            updateParams({ page: 1, per_page: Number(v) })
                        }
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
                        onClick={() => q.refetch()}
                        disabled={q.isFetching}
                    >
                        {q.isFetching ? "Aktualisiere…" : "Aktualisieren"}
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                {q.isLoading ? (
                    <div className="text-sm text-muted-foreground">Lade…</div>
                ) : q.isError ? (
                    <div className="flex items-center gap-2">
                        <div className="text-sm text-destructive">
                            Fehler: {(q.error as Error)?.message ?? "unknown"}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => q.refetch()}
                        >
                            Erneut versuchen
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="text-sm text-muted-foreground">
                            Gesamt:{" "}
                            <span className="font-medium text-foreground">
                                {total}
                            </span>{" "}
                            — Seite{" "}
                            <span className="font-medium text-foreground">
                                {q.data?.page ?? page}
                            </span>{" "}
                            / {totalPages}
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-20">
                                            ID
                                        </TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Provider</TableHead>
                                        <TableHead>Patient</TableHead>
                                        <TableHead>Betreff</TableHead>
                                        <TableHead>Von</TableHead>
                                        <TableHead className="whitespace-nowrap">
                                            Eingang
                                        </TableHead>
                                        <TableHead className="whitespace-nowrap">
                                            Erstellt
                                        </TableHead>
                                        <TableHead className="whitespace-nowrap">
                                            Geparst
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {(q.data?.items ?? []).length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={9}
                                                className="text-muted-foreground"
                                            >
                                                Keine Ergebnisse.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        q.data!.items.map((r) => (
                                            <TableRow key={r.id}>
                                                <TableCell className="font-medium">
                                                    {r.id}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={badgeVariant(
                                                            r.parse_status,
                                                        )}
                                                    >
                                                        {r.parse_status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="max-w-55 truncate">
                                                    {r.provider?.name ??
                                                        r.provider?.slug ??
                                                        "-"}
                                                </TableCell>
                                                <TableCell className="max-w-55 truncate">
                                                    {(r.patient?.first_name ??
                                                        "") +
                                                        " " +
                                                        (r.patient?.last_name ??
                                                            "")}
                                                </TableCell>
                                                <TableCell className="max-w-105 truncate">
                                                    {r.mail?.subject ?? "-"}
                                                </TableCell>
                                                <TableCell className="max-w-55 truncate">
                                                    {r.mail?.from_email ?? "-"}
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap">
                                                    {formatDate(
                                                        r.mail?.received_at,
                                                    )}
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap">
                                                    {formatDate(r.created_at)}
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap">
                                                    {formatDate(r.parsed_at)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="flex items-center justify-between gap-3 flex-wrap">
                            <div className="text-sm text-muted-foreground">
                                Seite{" "}
                                <span className="font-medium text-foreground">
                                    {page}
                                </span>{" "}
                                / {totalPages}
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateParams({ page: 1 })}
                                    disabled={page === 1}
                                >
                                    {"<<"}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        updateParams({
                                            page: Math.max(1, page - 1),
                                        })
                                    }
                                    disabled={page === 1}
                                >
                                    {"<"}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        updateParams({
                                            page: Math.min(
                                                totalPages,
                                                page + 1,
                                            ),
                                        })
                                    }
                                    disabled={page >= totalPages}
                                >
                                    {">"}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        updateParams({ page: totalPages })
                                    }
                                    disabled={page >= totalPages}
                                >
                                    {">>"}
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
