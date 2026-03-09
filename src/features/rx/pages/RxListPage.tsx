"use client";

import { TypographyH1 } from "@/components/ui/typography";

import { useRxListPage } from "../hooks/useRxListPage";
import { useRxPanels } from "../hooks/useRxPanels";
import { RxListPageContent } from "../components/RxListPageContent";
import { RxListPageLoading } from "../components/RxListPageLoading";

export function RxListPage() {
    const vm = useRxListPage();
    const panels = useRxPanels();

    const rowActions = {
        open: (id: number) => console.log("open", id),
        pdf: (id: number) => console.log("pdf", id),
        more: (id: number) => console.log("more", id),
        createInvoice: (id: number) => panels.invoice.open(id),
    };

    return (
        <div className="h-full w-full">
            <TypographyH1 className="mb-4">Rezepte</TypographyH1>

            {vm.listVm.isLoading && vm.tableVm.items.length === 0 ? (
                <RxListPageLoading
                    perPage={vm.tableVm.perPage}
                    toolbarVm={vm.toolbarVm}
                />
            ) : (
                <RxListPageContent
                    queueVm={vm.queueVm}
                    listVm={vm.listVm}
                    toolbarVm={vm.toolbarVm}
                    tableVm={vm.tableVm}
                    rowActions={rowActions}
                />
            )}
        </div>
    );
}
