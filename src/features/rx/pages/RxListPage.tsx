import { useMemo } from "react";
import { useSearchParams } from "react-router";
import { useRxListQuery } from "../queries/rx.queries";
import type { RxParseStatus } from "../types/rx.dto";

const PER_PAGE_OPTIONS = [10, 25, 50, 100] as const;

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

    const params = useMemo(
        () => ({
            page,
            per_page: perPage,
            parse_status: parseStatus,
            provider,
        }),
        [page, perPage, parseStatus, provider],
    );

    const q = useRxListQuery(params);

    const totalPages = q.data?.total_pages ?? 1;

    function updateParams(
        next: Partial<{
            page: number;
            per_page: number;
            parse_status: string;
            provider: string;
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

        setSp(n, { replace: true });
    }

    return (
        <div style={{ padding: 16, display: "grid", gap: 12 }}>
            <div
                style={{
                    display: "flex",
                    gap: 12,
                    flexWrap: "wrap",
                    alignItems: "center",
                }}
            >
                <h2 style={{ margin: 0 }}>RX</h2>

                <div
                    style={{
                        marginLeft: "auto",
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                    }}
                >
                    <select
                        value={parseStatus ?? "all"}
                        onChange={(e) => {
                            updateParams({
                                page: 1,
                                parse_status:
                                    e.target.value === "all"
                                        ? ""
                                        : e.target.value,
                            });
                        }}
                    >
                        <option value="all">Alle Status</option>
                        <option value="pending">pending</option>
                        <option value="parsed">parsed</option>
                        <option value="failed">failed</option>
                        <option value="parsed_with_warnings">
                            parsed_with_warnings
                        </option>
                    </select>

                    <input
                        value={providerRaw}
                        placeholder="Provider-Slug (optional)"
                        onChange={(e) =>
                            updateParams({ page: 1, provider: e.target.value })
                        }
                    />

                    <select
                        value={String(perPage)}
                        onChange={(e) =>
                            updateParams({
                                page: 1,
                                per_page: Number(e.target.value),
                            })
                        }
                    >
                        {PER_PAGE_OPTIONS.map((n) => (
                            <option key={n} value={n}>
                                {n} / Seite
                            </option>
                        ))}
                    </select>

                    <button onClick={() => q.refetch()} disabled={q.isFetching}>
                        {q.isFetching ? "Aktualisiere…" : "Aktualisieren"}
                    </button>
                </div>
            </div>

            {q.isLoading ? (
                <div>Lade…</div>
            ) : q.isError ? (
                <div>
                    Fehler: {(q.error as any)?.message ?? "unknown"}
                    <button
                        style={{ marginLeft: 8 }}
                        onClick={() => q.refetch()}
                    >
                        Erneut versuchen
                    </button>
                </div>
            ) : (
                <>
                    <div style={{ fontSize: 13, opacity: 0.8 }}>
                        Gesamt: <b>{q.data?.total ?? 0}</b> — Seite{" "}
                        <b>{q.data?.page ?? page}</b> / {totalPages}
                    </div>

                    <div
                        style={{
                            overflowX: "auto",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 8,
                        }}
                    >
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                            }}
                        >
                            <thead>
                                <tr>
                                    {[
                                        "ID",
                                        "Status",
                                        "Provider",
                                        "Patient",
                                        "Betreff",
                                        "Von",
                                        "Eingang",
                                        "Erstellt",
                                        "Geparst",
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            style={{
                                                textAlign: "left",
                                                padding: 10,
                                                borderBottom:
                                                    "1px solid rgba(255,255,255,0.08)",
                                            }}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {(q.data?.items ?? []).length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            style={{
                                                padding: 10,
                                                opacity: 0.8,
                                            }}
                                        >
                                            Keine Ergebnisse.
                                        </td>
                                    </tr>
                                ) : (
                                    q.data!.items.map((r) => (
                                        <tr key={r.id}>
                                            <td
                                                style={{
                                                    padding: 10,
                                                    borderBottom:
                                                        "1px solid rgba(255,255,255,0.06)",
                                                }}
                                            >
                                                {r.id}
                                            </td>
                                            <td
                                                style={{
                                                    padding: 10,
                                                    borderBottom:
                                                        "1px solid rgba(255,255,255,0.06)",
                                                }}
                                            >
                                                {r.parse_status}
                                            </td>
                                            <td
                                                style={{
                                                    padding: 10,
                                                    borderBottom:
                                                        "1px solid rgba(255,255,255,0.06)",
                                                }}
                                            >
                                                {r.provider?.name ??
                                                    r.provider?.slug ??
                                                    "-"}
                                            </td>
                                            <td
                                                style={{
                                                    padding: 10,
                                                    borderBottom:
                                                        "1px solid rgba(255,255,255,0.06)",
                                                }}
                                            >
                                                {(r.patient?.first_name ?? "") +
                                                    " " +
                                                    (r.patient?.last_name ??
                                                        "")}
                                            </td>
                                            <td
                                                style={{
                                                    padding: 10,
                                                    borderBottom:
                                                        "1px solid rgba(255,255,255,0.06)",
                                                }}
                                            >
                                                {r.mail?.subject ?? "-"}
                                            </td>
                                            <td
                                                style={{
                                                    padding: 10,
                                                    borderBottom:
                                                        "1px solid rgba(255,255,255,0.06)",
                                                }}
                                            >
                                                {r.mail?.from_email ?? "-"}
                                            </td>
                                            <td
                                                style={{
                                                    padding: 10,
                                                    borderBottom:
                                                        "1px solid rgba(255,255,255,0.06)",
                                                }}
                                            >
                                                {formatDate(
                                                    r.mail?.received_at,
                                                )}
                                            </td>
                                            <td
                                                style={{
                                                    padding: 10,
                                                    borderBottom:
                                                        "1px solid rgba(255,255,255,0.06)",
                                                }}
                                            >
                                                {formatDate(r.created_at)}
                                            </td>
                                            <td
                                                style={{
                                                    padding: 10,
                                                    borderBottom:
                                                        "1px solid rgba(255,255,255,0.06)",
                                                }}
                                            >
                                                {formatDate(r.parsed_at)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "center",
                        }}
                    >
                        <button
                            onClick={() => updateParams({ page: 1 })}
                            disabled={page === 1}
                        >
                            {"<<"}
                        </button>
                        <button
                            onClick={() =>
                                updateParams({ page: Math.max(1, page - 1) })
                            }
                            disabled={page === 1}
                        >
                            {"<"}
                        </button>

                        <span>
                            Seite <b>{page}</b> / {totalPages}
                        </span>

                        <button
                            onClick={() =>
                                updateParams({
                                    page: Math.min(totalPages, page + 1),
                                })
                            }
                            disabled={page >= totalPages}
                        >
                            {">"}
                        </button>
                        <button
                            onClick={() => updateParams({ page: totalPages })}
                            disabled={page >= totalPages}
                        >
                            {">>"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
