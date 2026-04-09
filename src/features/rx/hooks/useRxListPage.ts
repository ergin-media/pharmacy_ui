import { useRxListFilters } from "./useRxListFilters";
import { useRxListData } from "./useRxListData";
import { useRxListMutations } from "./useRxListMutations";
import { useRxPrimaryAction } from "./useRxPrimaryAction";
import { useRxPanels } from "./useRxPanels";

export function useRxListPage() {
    const filtersVm = useRxListFilters();
    const panels = useRxPanels();

    const dataVm = useRxListData({
        page: filtersVm.filters.page,
        perPage: filtersVm.filters.perPage,
        status: filtersVm.filters.status,
        processingTab: filtersVm.filters.processingTab,
        parseStatus: filtersVm.filters.parseStatus,
        workflowStatus: filtersVm.filters.workflowStatus,
        paymentState: filtersVm.filters.paymentState,
        provider: filtersVm.filters.provider,
        search: filtersVm.filters.search,
        sort: filtersVm.filters.sort,
    });

    const mutationsVm = useRxListMutations({
        openOfferCreate: panels.offerCreate.open,
        openShippingReady: panels.shippingReady?.open,
        openPickupReady: panels.pickupReady?.open,
    });

    const primaryActionVm = useRxPrimaryAction({
        controllers: mutationsVm.actions,
    });

    const statusVm = {
        value: filtersVm.filters.status,
        counts: dataVm.statusCounts,
        attentionCount: dataVm.attentionCount,
        setStatus: filtersVm.actions.setStatus,
    };

    const processingVm = {
        value: filtersVm.filters.processingTab,
        counts: dataVm.processingTabCounts,
        setProcessingTab: filtersVm.actions.setProcessingTab,
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
        onRefresh: () => {
            void dataVm.query.refetch();
        },
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
        refresh: () => {
            void dataVm.query.refetch();
        },
    };

    const tableVm = {
        status: filtersVm.filters.status,
        items: dataVm.items,
        page: filtersVm.filters.page,
        perPage: filtersVm.filters.perPage,
        isLoading: dataVm.query.isFetching,
        onReparse: mutationsVm.reparse.run,
        isReparseBusy: mutationsVm.reparse.isBusy,
        onPrimaryAction: primaryActionVm.handlePrimaryAction,
        isPrimaryActionPending: mutationsVm.primaryActionState.isPending,
        activePrimaryActionId: mutationsVm.primaryActionState.activeId,
    };

    return {
        query: dataVm.query,
        statusVm,
        processingVm,
        toolbarVm,
        listVm,
        tableVm,
    };
}
