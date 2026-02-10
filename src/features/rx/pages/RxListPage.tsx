import { useMemo, useState } from "react";
import { useRxListQuery } from "../queries/rx.queries";
import type { RxParseStatus } from "../types/rx.dto";

const PER_PAGE_OPTIONS = [10, 25, 50, 100] as const;

function formatDate(value?: string | null) {
    if (!value) return "-";
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
}

export function RxListPage() {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] =
        useState<(typeof PER_PAGE_OPTIONS)[number]>(25);
    const [parseStatus, setParseStatus] = useState<RxParseStatus | "all">(
        "all",
    );
    const [provider, setProvider] = useState("");

    const params = useMemo(
        () => ({
            page,
            per_page: perPage,
            parse_status: parseStatus === "all" ? undefined : parseStatus,
            provider: provider.trim() ? provider.trim() : undefined,
        }),
        [page, perPage, parseStatus, provider],
    );

    const q = useRxListQuery(params);

    const total = q.data?.total ?? 0;
    const totalPages = q.data?.total_pages ?? 1;

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
                        value={parseStatus}
                        onChange={(e) => {
                            setPage(1);
                            setParseStatus(e.target.value as any);
                        }}
                    >
                        <option value="all">All statuses</option>
                        <option value="pending">pending</option>
                        <option value="parsed">parsed</option>
                        <option value="failed">failed</option>
                        <option value="parsed_with_warnings">
                            parsed_with_warnings
                        </option>
                    </select>

                    <input
                        value={provider}
                        placeholder="provider slug (optional)"
                        onChange={(e) => {
                            setPage(1);
                            setProvider(e.target.value);
                        }}
                    />

                    <select
                        value={String(perPage)}
                        onChange={(e) => {
                            setPage(1);
                            setPerPage(Number(e.target.value) as any);
                        }}
                    >
                        {PER_PAGE_OPTIONS.map((n) => (
                            <option key={n} value={n}>
                                {n} / page
                            </option>
                        ))}
                    </select>

                    <button onClick={() => q.refetch()} disabled={q.isFetching}>
                        {q.isFetching ? "Refreshing…" : "Refresh"}
                    </button>
                </div>
            </div>

            {q.isLoading ? (
                <div>Loading…</div>
            ) : q.isError ? (
                <div>
                    Failed: {(q.error as any)?.message ?? "unknown"}
                    <button
                        style={{ marginLeft: 8 }}
                        onClick={() => q.refetch()}
                    >
                        Retry
                    </button>
                </div>
            ) : (
                <>
                    <div style={{ fontSize: 13, opacity: 0.8 }}>
                        Total: <b>{total}</b> — Page{" "}
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
                                        "Subject",
                                        "From",
                                        "Created",
                                        "Parsed",
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
                                            colSpan={8}
                                            style={{
                                                padding: 10,
                                                opacity: 0.8,
                                            }}
                                        >
                                            No results.
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
                            onClick={() => setPage(1)}
                            disabled={page === 1}
                        >
                            {"<<"}
                        </button>
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            {"<"}
                        </button>

                        <span>
                            Page <b>{page}</b> / {totalPages}
                        </span>

                        <button
                            onClick={() =>
                                setPage((p) => Math.min(totalPages, p + 1))
                            }
                            disabled={page >= totalPages}
                        >
                            {">"}
                        </button>
                        <button
                            onClick={() => setPage(totalPages)}
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
