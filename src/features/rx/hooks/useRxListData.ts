import { useMemo } from "react";

import { useRxListQuery } from "../queries/rx.queries";
import type {
    RxListQueryParams,
    RxParseStatus,
    RxPaymentState,
    RxQueueCounts,
    RxWorkflowStatus,
} from "../types/rx.dto";
import type { RxQueue } from "../lib/rx.queues";

export function useRxListData(input: {
    page: number;
    perPage: number;
    queue: RxQueue;
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
        queue,
        parseStatus,
        workflowStatus,
        paymentState,
        provider,
        search,
        sort,
    } = input;

    const params = useMemo<RxListQueryParams>(
        () => ({
            page,
            per_page: perPage,
            queue: queue !== "all" ? queue : undefined,
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
            queue,
            parseStatus,
            workflowStatus,
            paymentState,
            provider,
            search,
            sort,
        ],
    );

    const query = useRxListQuery(params);

    const items = query.data?.items ?? [];
    const total = query.data?.total ?? 0;
    const totalPages =
        query.data?.total_pages && query.data.total_pages > 0
            ? query.data.total_pages
            : 1;
    const queueCounts: RxQueueCounts = query.data?.queue_counts ?? {};

    return {
        params,
        query,
        items,
        total,
        totalPages,
        queueCounts,
    };
}
