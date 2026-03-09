import type { useRxListPage } from "../hooks/useRxListPage";

export type RxListPageVm = ReturnType<typeof useRxListPage>;

export type RxQueueVm = RxListPageVm["queueVm"];
export type RxToolbarVm = RxListPageVm["toolbarVm"];
export type RxListVm = RxListPageVm["listVm"];
export type RxTableVm = RxListPageVm["tableVm"];

export type RxRowActions = {
    open: (id: number) => void;
    pdf: (id: number) => void;
    more: (id: number) => void;
    createInvoice: (id: number) => void;
};
