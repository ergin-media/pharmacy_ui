import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";

import { queryClient } from "./queryClient";
import { router } from "./router";

import { TooltipProvider } from "@/components/ui/tooltip";

import { SlideInPanelProvider } from "@/shared/ui/slide-in-panel/slideInPanel.store";
import { SlideInPanelHost } from "@/shared/ui/slide-in-panel/SlideInPanelHost";

import { AppDialogProvider } from "@/shared/ui/dialogs/appDialog.store";
import { AppDialogHost } from "@/shared/ui/dialogs/AppDialogHost";

import { Toaster } from "sonner";

export function AppProviders() {
    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <AppDialogProvider>
                    <SlideInPanelProvider>
                        <RouterProvider router={router} />
                        <SlideInPanelHost />
                        <AppDialogHost />

                        <Toaster
                            position="top-center"
                            richColors
                            expand
                            closeButton
                            duration={1000}
                        />
                    </SlideInPanelProvider>
                </AppDialogProvider>
            </TooltipProvider>
        </QueryClientProvider>
    );
}