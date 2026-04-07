import { useMemo } from "react";

import { useRxListQuery } from "../queries/rx.queries";
import type {
    RxListQueryParams,
    RxParseStatus,
    RxPaymentState,
    RxStatus,
    RxWorkflowStatus,
} from "../types/rx.dto";
import type { RxStatusCounts } from "../lib/rx.status-panels";

type RxListPanelStatus = RxStatus | "attention";

export function useRxListData(input: {
    page: number;
    perPage: number;
    status?: RxListPanelStatus;
    parseStatus?: RxParseStatus;
    workflowStatus?: RxWorkflowStatus;
    paymentState?: RxPaymentState;
    provider?: string;
    search?: string;
    sort: string;
}) {
    const {
        page,
        perPage,
        status,
        parseStatus,
        workflowStatus,
        paymentState,
        provider,
        search,
        sort,
    } = input;

    const apiStatus = status === "attention" ? undefined : status;

    const params = useMemo<RxListQueryParams>(
        () => ({
            page,
            per_page: perPage,
            status: apiStatus,
            parse_status: parseStatus,
            workflow_status: workflowStatus,
            payment_state: paymentState,
            provider,
            search,
            sort,
        }),
        [
            page,
            perPage,
            apiStatus,
            parseStatus,
            workflowStatus,
            paymentState,
            provider,
            search,
            sort,
        ],
    );

    const query = useRxListQuery(params);

    const allItems = query.data?.items ?? [];

    const items =
        status === "attention"
            ? allItems.filter((item) => item.has_attention === true)
            : allItems;

    const total =
        status === "attention"
            ? (query.data?.attention_count ?? items.length)
            : (query.data?.total ?? 0);

    const totalPages =
        status === "attention"
            ? Math.max(1, Math.ceil(total / perPage))
            : query.data?.total_pages && query.data.total_pages > 0
              ? query.data.total_pages
              : 1;

    const statusCounts: RxStatusCounts = query.data?.status_counts ?? {};
    const attentionCount = query.data?.attention_count ?? 0;

    return {
        params,
        query,
        items,
        total,
        totalPages,
        statusCounts,
        attentionCount,
    };
}
