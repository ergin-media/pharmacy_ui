import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import { useDebouncedValue } from "@/shared/lib/hooks/useDebouncedValue";
import {
    spGetInt,
    spGetString,
    spSetInt,
    spSetOrDelete,
} from "@/shared/lib/url/searchParams";

import { usePatientsListQuery } from "../queries/patients.queries";
import {
    ALLOWED_SORTS,
    DEFAULT_PER_PAGE,
    DEFAULT_SORT,
} from "../lib/patients.constants";
import type { PatientsIssues, PatientsSort } from "../types/patients.list.dto";

export function usePatientsListPage() {
    const [sp, setSp] = useSearchParams();

    const page = Math.max(1, spGetInt(sp, "page", 1));
    const perPage = Math.max(
        1,
        Math.min(100, spGetInt(sp, "per_page", DEFAULT_PER_PAGE)),
    );

    const sortRaw = spGetString(sp, "sort");
    const sort: PatientsSort = (ALLOWED_SORTS as readonly string[]).includes(
        sortRaw,
    )
        ? (sortRaw as PatientsSort)
        : DEFAULT_SORT;

    const issuesRaw = spGetString(sp, "issues"); // "all" | "with_issues"
    const issues: PatientsIssues =
        issuesRaw === "missing" ? "missing" : "all";

    const searchRaw = spGetString(sp, "search");
    const [searchInput, setSearchInput] = useState(searchRaw);

    useEffect(() => {
        setSearchInput(searchRaw);
    }, [searchRaw]);

    const debouncedSearch = useDebouncedValue(
        searchInput.trim() || undefined,
        500,
    );

    function patch(
        next: Partial<{
            page: number;
            per_page: number;
            search: string;
            sort: string;
            issues: string;
        }>,
    ) {
        const n = new URLSearchParams(sp);

        if (next.page !== undefined) spSetInt(n, "page", next.page);
        if (next.per_page !== undefined) spSetInt(n, "per_page", next.per_page);
        if (next.sort !== undefined) spSetOrDelete(n, "sort", next.sort);
        if (next.issues !== undefined) spSetOrDelete(n, "issues", next.issues);

        setSp(n, { replace: true });
    }

    useEffect(() => {
        const n = new URLSearchParams(sp);
        spSetInt(n, "page", 1);
        spSetOrDelete(n, "search", debouncedSearch ?? "");
        setSp(n, { replace: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const params = useMemo(
        () => ({
            page,
            per_page: perPage,
            search: debouncedSearch,
            sort,
            issues,
        }),
        [page, perPage, debouncedSearch, sort, issues],
    );

    const query = usePatientsListQuery(params);
    const total = query.data?.total ?? 0;
    const totalPages = query.data?.total_pages ?? 1;

    const actions = {
        setSearch: (v: string) => setSearchInput(v),
        setSort: (v: PatientsSort) => patch({ page: 1, sort: v }),
        setIssues: (v: "all" | "with_issues") => patch({ page: 1, issues: v }),
        setPerPage: (v: number) => patch({ page: 1, per_page: v }),
        setPage: (v: number) => patch({ page: v }),
        refresh: () => query.refetch(),
    };

    return {
        filters: {
            page,
            perPage,
            searchRaw: searchInput,
            sort,
            issues,
        },
        query,
        meta: { total, totalPages },
        actions,
    };
}
