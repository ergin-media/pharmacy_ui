import {
    createContext,
    useContext,
    useMemo,
    useReducer,
    type ReactNode,
} from "react";
import type { SlideInPanelOptions, SlideInPanelState } from "./slideInPanel.types";

type Action =
    | { type: "OPEN"; payload: SlideInPanelState }
    | { type: "CLOSE_TOP" }
    | { type: "REMOVE_TOP" };

function uid() {
    return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function reducer(state: SlideInPanelState[], action: Action): SlideInPanelState[] {
    switch (action.type) {
        case "OPEN":
            return [...state, action.payload];

        case "CLOSE_TOP":
            if (state.length === 0) return state;
            return state.map((p, idx) =>
                idx === state.length - 1 ? { ...p, isOpen: false } : p,
            );

        case "REMOVE_TOP":
            if (state.length === 0) return state;
            return state.slice(0, -1);

        default:
            return state;
    }
}

type SlideInPanelCtx = {
    panels: SlideInPanelState[];
    openPanel: (options: SlideInPanelOptions) => void;
    closeTop: () => void;
    removeTop: () => void; // vom Host aufgerufen nach Exit
};

const SlideInPanelContext = createContext<SlideInPanelCtx | null>(null);

export function SlideInPanelProvider({ children }: { children: ReactNode }) {
    const [panels, dispatch] = useReducer(reducer, []);

    const api = useMemo<SlideInPanelCtx>(
        () => ({
            panels,

            openPanel: (options) => {
                dispatch({
                    type: "OPEN",
                    payload: {
                        id: uid(),
                        isOpen: true,
                        backdropClosable: false,
                        variant: "md",
                        ...options,
                    },
                });
            },

            closeTop: () => dispatch({ type: "CLOSE_TOP" }),

            removeTop: () => dispatch({ type: "REMOVE_TOP" }),
        }),
        [panels],
    );

    return (
        <SlideInPanelContext.Provider value={api}>
            {children}
        </SlideInPanelContext.Provider>
    );
}

export function useSlideInPanel() {
    const ctx = useContext(SlideInPanelContext);
    if (!ctx) {
        throw new Error(
            "useSlideInPanel muss innerhalb SlideInPanelProvider verwendet werden.",
        );
    }
    return ctx;
}
