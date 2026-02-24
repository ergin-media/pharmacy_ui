import type { ReactNode } from "react";

export type SlideInPanelVariant = "sm" | "md" | "lg" | "custom";

export type SlideInPanelRenderApi = {
    close: () => void;
};

export type SlideInPanelOptions = {
    title: string;
    description?: string;

    render: (api: SlideInPanelRenderApi) => ReactNode;

    backdropClosable?: boolean;
    headerRight?: ReactNode;

    variant?: SlideInPanelVariant;
    widthClassName?: string; // nur bei "custom"
    onClosed?: () => void;
};

export type SlideInPanelState = SlideInPanelOptions & {
    id: string;
    isOpen: boolean;
};
