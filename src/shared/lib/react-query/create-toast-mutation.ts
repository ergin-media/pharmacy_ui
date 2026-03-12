import {
    useMutation,
    type MutationFunction,
    type MutationFunctionContext,
    type UseMutationOptions,
} from "@tanstack/react-query";
import { appToast } from "@/shared/lib/toast/toast";

type ToastMessages<TData, TVariables, TError> = {
    loading?: string | ((variables: TVariables) => string);
    success?: string | ((data: TData, variables: TVariables) => string);
    error?: string | ((error: TError, variables: TVariables) => string);
};

export function useToastMutation<
    TData,
    TError = Error,
    TVariables = void,
    TOnMutateResult = unknown,
>(
    options: Omit<
        UseMutationOptions<
            TData,
            TError,
            TVariables,
            TOnMutateResult | undefined
        >,
        "mutationFn"
    > & {
        mutationFn: MutationFunction<TData, TVariables>;
        toastMessages?: ToastMessages<TData, TVariables, TError>;
    },
) {
    const {
        toastMessages,
        mutationFn,
        onMutate,
        onSuccess,
        onError,
        ...rest
    } = options;

    return useMutation<
        TData,
        TError,
        TVariables,
        TOnMutateResult | undefined
    >({
        mutationFn,
        ...rest,

        onMutate: async (
            variables,
            context: MutationFunctionContext,
        ) => {
            const toastId = `mutation-${JSON.stringify(variables)}`;

            if (toastMessages?.loading) {
                const message =
                    typeof toastMessages.loading === "function"
                        ? toastMessages.loading(variables)
                        : toastMessages.loading;

                appToast.loading(message, toastId);
            }

            return await onMutate?.(variables, context);
        },

        onSuccess: async (
            data,
            variables,
            onMutateResult,
            context,
        ) => {
            const toastId = `mutation-${JSON.stringify(variables)}`;

            if (toastMessages?.success) {
                const message =
                    typeof toastMessages.success === "function"
                        ? toastMessages.success(data, variables)
                        : toastMessages.success;

                appToast.success(message);
            }

            appToast.dismiss(toastId);

            await onSuccess?.(data, variables, onMutateResult, context);
        },

        onError: async (
            error,
            variables,
            onMutateResult,
            context,
        ) => {
            const toastId = `mutation-${JSON.stringify(variables)}`;

            if (toastMessages?.error) {
                const message =
                    typeof toastMessages.error === "function"
                        ? toastMessages.error(error, variables)
                        : toastMessages.error;

                appToast.error(message);
            }

            appToast.dismiss(toastId);

            await onError?.(error, variables, onMutateResult, context);
        },
    });
}