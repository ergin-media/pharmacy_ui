import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useReducer,
    type ReactNode,
} from "react";

import type {
    AppConfirmDialogOptions,
    AppConfirmDialogState,
} from "./appDialog.types";

type State = {
    confirmDialog: AppConfirmDialogState | null;
};

type Action =
    | { type: "OPEN_CONFIRM"; payload: AppConfirmDialogState }
    | { type: "CLOSE_CONFIRM" }
    | { type: "SET_CONFIRM_LOADING"; payload: boolean };

function uid() {
    return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "OPEN_CONFIRM":
            return {
                ...state,
                confirmDialog: action.payload,
            };

        case "CLOSE_CONFIRM":
            return {
                ...state,
                confirmDialog: null,
            };

        case "SET_CONFIRM_LOADING":
            if (!state.confirmDialog) return state;

            return {
                ...state,
                confirmDialog: {
                    ...state.confirmDialog,
                    isLoading: action.payload,
                },
            };

        default:
            return state;
    }
}

type AppDialogContextValue = {
    state: State;
    confirm: (options: AppConfirmDialogOptions) => void;
    closeConfirm: () => void;
    runConfirm: () => Promise<void>;
};

const AppDialogContext = createContext<AppDialogContextValue | null>(null);

export function AppDialogProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, {
        confirmDialog: null,
    });

    const closeConfirm = useCallback(() => {
        dispatch({ type: "CLOSE_CONFIRM" });
    }, []);

    const confirm = useCallback((options: AppConfirmDialogOptions) => {
        dispatch({
            type: "OPEN_CONFIRM",
            payload: {
                id: uid(),
                open: true,
                isLoading: false,
                ...options,
            },
        });
    }, []);

    const runConfirm = useCallback(async () => {
        const dialog = state.confirmDialog;
        if (!dialog || dialog.isLoading) return;

        dispatch({ type: "SET_CONFIRM_LOADING", payload: true });

        try {
            await dialog.onConfirm();
            dispatch({ type: "CLOSE_CONFIRM" });
        } catch {
            dispatch({ type: "SET_CONFIRM_LOADING", payload: false });
            throw new Error("confirm_action_failed");
        }
    }, [state.confirmDialog]);

    const value = useMemo<AppDialogContextValue>(
        () => ({
            state,
            confirm,
            closeConfirm,
            runConfirm,
        }),
        [state, confirm, closeConfirm, runConfirm],
    );

    return (
        <AppDialogContext.Provider value={value}>
            {children}
        </AppDialogContext.Provider>
    );
}

export function useAppDialog() {
    const ctx = useContext(AppDialogContext);

    if (!ctx) {
        throw new Error(
            "useAppDialog muss innerhalb von AppDialogProvider verwendet werden.",
        );
    }

    return ctx;
}