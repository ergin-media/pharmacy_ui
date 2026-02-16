import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import { queryClient } from "./queryClient";
import { router } from "./router";
import { SlideInPanelProvider } from "@/shared/ui/slide-in-panel/slideInPanel.store";
import { SlideInPanelHost } from "@/shared/ui/slide-in-panel/SlideInPanelHost";

export function AppProviders() {
    return (
        <QueryClientProvider client={queryClient}>
            <SlideInPanelProvider>
                <RouterProvider router={router} />
                <SlideInPanelHost />
            </SlideInPanelProvider>
        </QueryClientProvider>
    );
}
