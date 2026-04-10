import type {
    RxProcessingVm,
    RxStatusVm,
    RxToolbarVm,
} from "../types/rx.list.vm";
import { RxListToolbar } from "./RxListToolbar";
import { RxListTableSkeleton } from "./RxListTableSkeleton";
import { RxStatusPanels } from "./RxStatusPanels";
import { RxProcessingSubTabs } from "./RxProcessingSubTabs";
import { Card } from "@/components/ui/card";

export function RxListPageLoading(props: {
    perPage: number;
    toolbarVm: RxToolbarVm;
    statusVm: RxStatusVm;
    processingVm: RxProcessingVm;
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) {
    const {
        perPage,
        toolbarVm,
        statusVm,
        processingVm,
        page,
        totalPages,
        onPageChange,
    } = props;

    return (
        <div className="grid gap-4">
            <Card>
                <RxStatusPanels
                    value={statusVm.value}
                    counts={statusVm.counts}
                    attentionCount={statusVm.attentionCount}
                    onChange={statusVm.setStatus}
                />

                {statusVm.value === "processing" ? (
                    <RxProcessingSubTabs
                        value={processingVm.value}
                        counts={processingVm.counts}
                        onChange={processingVm.setProcessingTab}
                    />
                ) : null}

                <RxListToolbar
                    {...toolbarVm}
                    page={page}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />

                <RxListTableSkeleton rows={perPage} />
            </Card>
        </div>
    );
}
