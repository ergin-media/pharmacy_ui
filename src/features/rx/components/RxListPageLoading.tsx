import type { RxStatusVm, RxToolbarVm } from "../types/rx.list.vm";
import { RxListToolbar } from "./RxListToolbar";
import { RxListTableSkeleton } from "./RxListTableSkeleton";
import { RxStatusPanels } from "./RxStatusPanels";

export function RxListPageLoading(props: {
    perPage: number;
    toolbarVm: RxToolbarVm;
    statusVm: RxStatusVm;
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) {
    const { perPage, toolbarVm, statusVm, page, totalPages, onPageChange } =
        props;

    return (
        <div className="grid gap-4">
            <RxStatusPanels
                value={statusVm.value}
                counts={statusVm.counts}
                attentionCount={statusVm.attentionCount}
                onChange={statusVm.setStatus}
            />

            <RxListToolbar
                {...toolbarVm}
                page={page}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />

            <RxListTableSkeleton rows={perPage} />
        </div>
    );
}
