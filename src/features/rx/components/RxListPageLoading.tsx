import type { RxQueueVm, RxToolbarVm } from "../types/rx.list.vm";
import { RxListToolbar } from "./RxListToolbar";
import { RxListTableSkeleton } from "./RxListTableSkeleton";

export function RxListPageLoading(props: {
    perPage: number;
    toolbarVm: RxToolbarVm;
    queueVm: RxQueueVm;
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) {
    const {
        perPage,
        toolbarVm,
        queueVm,
        page,
        totalPages,
        onPageChange,
    } = props;

    return (
        <div className="grid gap-4">
            <RxListToolbar
                {...toolbarVm}
                queue={queueVm.value}
                queueCounts={queueVm.counts}
                onQueueChange={queueVm.setQueue}
                page={page}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />

            <RxListTableSkeleton rows={perPage} />
        </div>
    );
}