import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import { queryClient } from "./queryClient";
import { router } from "./router";
import { SlideInPanelProvider } from "@/shared/ui/slide-in-panel/slideInPanel.store";
import { SlideInPanelHost } from "@/shared/ui/slide-in-panel/SlideInPanelHost";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppDialogProvider } from "@/shared/ui/dialogs/appDialog.store";

export function AppProviders() {
    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <AppDialogProvider>
                    <SlideInPanelProvider>
                        <RouterProvider router={router} />
                        <SlideInPanelHost />
                    </SlideInPanelProvider>
                </AppDialogProvider>
            </TooltipProvider>
        </QueryClientProvider>
    );
}
