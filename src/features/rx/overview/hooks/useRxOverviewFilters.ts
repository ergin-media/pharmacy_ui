import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import { useDebouncedValue } from "@/shared/lib/hooks/useDebouncedValue";
import {
    spGetInt,
    spGetString,
    spSetInt,
    spSetOrDelete,
} from "@/shared/lib/url/searchParams";

import type { RxOverviewStatus } from "../lib/rx-overview.status";

const DEFAULT_PER_PAGE = 25;

const ALLOWED_STATUS: Array<RxOverviewStatus | "open"> = [
    "attention",
    "new",
    "offer_required",
    "awaiting_payment",
    "paid",
    "in_progress",
    "ready",
    "completed",
    "open",
];

type PatchValues = Partial<{
    page: number;
    per_page: number;
    provider: string;
    search: string;
    status: string;
    only_attention: string;
}>;

function normalizeStatus(value: string | null): RxOverviewStatus | "open" | undefined {
    const normalized = (value ?? "").trim();
    return ALLOWED_STATUS.includes(normalized as RxOverviewStatus | "open")
        ? (normalized as RxOverviewStatus | "open")
        : undefined;
}

export function useRxOverviewFilters() {
    const [sp, setSp] = useSearchParams();

    const page = Math.max(1, spGetInt(sp, "page", 1));
    const perPage = Math.max(
        1,
        Math.min(100, spGetInt(sp, "per_page", DEFAULT_PER_PAGE)),
    );

    const providerRaw = spGetString(sp, "provider") ?? "";
    const provider = providerRaw || undefined;

    const status = normalizeStatus(spGetString(sp, "status"));

    const onlyAttentionRaw = spGetString(sp, "only_attention") ?? "";
    const onlyAttention =
        onlyAttentionRaw === "1" || onlyAttentionRaw === "true";

    const searchRaw = spGetString(sp, "search") ?? "";
    const [searchInput, setSearchInput] = useState(searchRaw);

    useEffect(() => {
        setSearchInput(searchRaw);
    }, [searchRaw]);

    const debouncedSearch = useDebouncedValue(searchInput.trim(), 500);
    const debouncedSearchParam = debouncedSearch || undefined;

    function patch(values: PatchValues) {
        const next = new URLSearchParams(sp);

        for (const [key, value] of Object.entries(values)) {
            if (value === undefined) continue;

            if (typeof value === "number") {
                spSetInt(next, key, value);
            } else {
                spSetOrDelete(next, key, value);
            }
        }

        setSp(next, { replace: true });
    }

    useEffect(() => {
        const next = new URLSearchParams(sp);
        spSetInt(next, "page", 1);
        spSetOrDelete(next, "search", debouncedSearch);
        setSp(next, { replace: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const filters = useMemo(
        () => ({
            page,
            perPage,
            providerRaw,
            provider,
            searchRaw: searchInput,
            search: debouncedSearchParam,
            status,
            onlyAttention,
        }),
        [
            page,
            perPage,
            providerRaw,
            provider,
            searchInput,
            debouncedSearchParam,
            status,
            onlyAttention,
        ],
    );

    const actions = {
        setProvider: (value: string) =>
            patch({
                page: 1,
                provider: value,
            }),

        setSearch: (value: string) => setSearchInput(value),

        setStatus: (value?: RxOverviewStatus | "open") =>
            patch({
                page: 1,
                status: value ?? "",
            }),

        setOnlyAttention: (value: boolean) =>
            patch({
                page: 1,
                only_attention: value ? "1" : "",
            }),

        setPerPage: (value: number) =>
            patch({
                page: 1,
                per_page: value,
            }),

        setPage: (value: number) =>
            patch({
                page: value,
            }),
    };

    return {
        filters,
        actions,
    };
}