import type { useRxListPage } from "../hooks/useRxListPage";
import type { RxListItemDto } from "./rx.dto";

export type RxListPageVm = ReturnType<typeof useRxListPage>;

export type RxQueueVm = RxListPageVm["queueVm"];
export type RxToolbarVm = RxListPageVm["toolbarVm"];
export type RxListVm = RxListPageVm["listVm"];
export type RxTableVm = RxListPageVm["tableVm"];

export type RxRowActions = {
    open: (rx: RxListItemDto) => void;
    pdf: (rx: RxListItemDto) => void;
    more: (rx: RxListItemDto) => void;
    createInvoice: (rx: RxListItemDto) => void;
};
