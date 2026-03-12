import { useRxListFilters } from "./useRxListFilters";
import { useRxListData } from "./useRxListData";
import { useRxListMutations } from "./useRxListMutations";
import { useRxPrimaryAction } from "./useRxPrimaryAction";
import { useRxPanels } from "./useRxPanels";

export function useRxListPage() {
    const filtersVm = useRxListFilters();

    const dataVm = useRxListData({
        page: filtersVm.filters.page,
        perPage: filtersVm.filters.perPage,
        queue: filtersVm.filters.queue,
        parseStatus: filtersVm.filters.parseStatus,
        workflowStatus: filtersVm.filters.workflowStatus,
        paymentState: filtersVm.filters.paymentState,
        provider: filtersVm.filters.provider,
        search: filtersVm.filters.search,
        sort: filtersVm.filters.sort,
    });

    const mutationsVm = useRxListMutations();
    const panels = useRxPanels();

    const primaryActionVm = useRxPrimaryAction({
        queue: filtersVm.filters.queue,
        actions: {
            takeOver: mutationsVm.actions.takeOver,
            openOfferCreate: panels.offerCreate.open,

            confirmPayment: async (id: number) => {
                console.warn("confirmPayment not implemented yet", id);
            },

            startPackaging: async (id: number) => {
                console.warn("startPackaging not implemented yet", id);
            },

            finishPackaging: async (id: number) => {
                console.warn("finishPackaging not implemented yet", id);
            },

            markShipped: async (id: number) => {
                console.warn("markShipped not implemented yet", id);
            },

            markPickedUp: async (id: number) => {
                console.warn("markPickedUp not implemented yet", id);
            },
        },
    });

    const queueVm = {
        value: filtersVm.filters.queue,
        counts: dataVm.queueCounts,
        setQueue: filtersVm.actions.setQueue,
    };

    const toolbarVm = {
        total: dataVm.total,
        page: filtersVm.filters.page,
        totalPages: dataVm.totalPages,
        parseStatus: filtersVm.filters.parseStatus,
        workflowStatus: filtersVm.filters.workflowStatus,
        paymentState: filtersVm.filters.paymentState,
        providerRaw: filtersVm.filters.providerRaw,
        searchRaw: filtersVm.filters.searchRaw,
        sort: filtersVm.filters.sort,
        perPage: filtersVm.filters.perPage,
        isFetching: dataVm.query.isFetching,
        onParseStatusChange: filtersVm.actions.setParseStatus,
        onWorkflowStatusChange: filtersVm.actions.setWorkflowStatus,
        onPaymentStateChange: filtersVm.actions.setPaymentState,
        onProviderChange: filtersVm.actions.setProvider,
        onSearchChange: filtersVm.actions.setSearch,
        onSortChange: filtersVm.actions.setSort,
        onPerPageChange: filtersVm.actions.setPerPage,
        onPageChange: filtersVm.actions.setPage,
        onRefresh: () => dataVm.query.refetch(),
    };

    const listVm = {
        page: filtersVm.filters.page,
        total: dataVm.total,
        totalPages: dataVm.totalPages,
        isFetching: dataVm.query.isFetching,
        isLoading: dataVm.query.isLoading,
        isError: dataVm.query.isError,
        error: dataVm.query.isError ? dataVm.query.error : null,
        setPage: filtersVm.actions.setPage,
        refresh: () => dataVm.query.refetch(),
    };

    const tableVm = {
        queue: filtersVm.filters.queue,
        items: dataVm.items,
        page: filtersVm.filters.page,
        perPage: filtersVm.filters.perPage,
        isLoading: dataVm.query.isFetching,
        reparseBusyId: mutationsVm.busy.reparseBusyId,
        takeOverBusyId: mutationsVm.busy.takeOverBusyId,
        onReparse: mutationsVm.actions.reparse,
        onPrimaryAction: primaryActionVm.handlePrimaryAction,
    };

    return {
        query: dataVm.query,
        queueVm,
        toolbarVm,
        listVm,
        tableVm,
    };
}
