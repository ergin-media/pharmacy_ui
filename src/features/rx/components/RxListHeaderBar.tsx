"use client";

import { Pagination } from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { RxListToolbar } from "./RxListToolbar";

export function RxListHeaderBar(props: {
    page: number;
    totalPages: number;
    isFetching: boolean;
    onPageChange: (page: number) => void;
    toolbarProps: React.ComponentProps<typeof RxListToolbar>;
}) {
    const { page, totalPages, isFetching, onPageChange, toolbarProps } = props;

    return (
        <div className="flex flex-wrap items-center justify-between gap-4">
            <RxListToolbar
                {...toolbarProps}
                page={page}
                totalPages={totalPages}
            />

            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={onPageChange}
                isLoading={isFetching}
                showStatus={false}
            />
        </div>
    );
}