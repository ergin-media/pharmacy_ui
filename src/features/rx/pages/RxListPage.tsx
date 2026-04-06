"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TypographyH1 } from "@/components/ui/typography";

import { useRxListPage } from "../hooks/useRxListPage";
import { useRxPanels } from "../hooks/useRxPanels";
import { RxListPageContent } from "../components/RxListPageContent";
import { RxListPageLoading } from "../components/RxListPageLoading";
import type { RxListItemDto } from "../types/rx.dto";

export function RxListPage() {
    const vm = useRxListPage();
    const panels = useRxPanels();

    const rowActions = {
        open: (id: number) => console.log("open", id),
        pdf: (id: number) => console.log("pdf", id),
        more: (id: number) => console.log("more", id),
        createInvoice: (rx: RxListItemDto) => panels.invoice.open(rx),
    };

    return (
        <div className="h-full w-full">
            <div className="mb-4 flex items-center justify-between">
                <TypographyH1>Rezepte</TypographyH1>

                <Button onClick={panels.manualCreate.open}>
                    <Plus className="mr-2 size-4" />
                    Rezept manuell anlegen
                </Button>
            </div>

            {vm.listVm.isLoading && vm.tableVm.items.length === 0 ? (
                <RxListPageLoading
                    perPage={vm.tableVm.perPage}
                    toolbarVm={vm.toolbarVm}
                    queueVm={vm.queueVm}
                    page={vm.listVm.page}
                    totalPages={vm.listVm.totalPages}
                    onPageChange={vm.listVm.setPage}
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