import {
    createContext,
    useContext,
    useMemo,
    useReducer,
    type ReactNode,
} from "react";

import type {
    SlideInPanelOptions,
    SlideInPanelState,
    SlideInPanelVariant,
} from "./slideInPanel.types";

type Action =
    | { type: "OPEN"; payload: SlideInPanelState }
    | { type: "CLOSE_TOP" }
    | { type: "REMOVE_TOP" };

function uid() {
    return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function reducer(
    state: SlideInPanelState[],
    action: Action,
): SlideInPanelState[] {
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

//
// 👉 ZENTRALES WIDTH-MAPPING (Tailwind + responsive)
//
export function getPanelWidthClass(
    variant: SlideInPanelVariant,
    custom?: string,
) {
    if (variant === "custom") {
        return custom ?? "w-full";
    }

    const map: Record<Exclude<SlideInPanelVariant, "custom">, string> = {
        sm: "w-full sm:max-w-sm", // ~384px
        md: "w-full sm:max-w-md", // ~448px
        lg: "w-full sm:max-w-lg", // ~512px
        xl: "w-full sm:max-w-xl", // ~576px
        "2xl": "w-full sm:max-w-2xl", // ~672px
        fullwidth: "w-full max-w-none", // full width
    };

    return map[variant];
}

type SlideInPanelCtx = {
    panels: SlideInPanelState[];
    openPanel: (options: SlideInPanelOptions) => void;
    closeTop: () => void;
    removeTop: () => void;
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
