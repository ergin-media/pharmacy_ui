import { Outlet, useLocation } from "react-router";
import { getTitleForPath } from "@/shared/nav/nav.helpers";

import { AppSidebar } from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";

export function AppShell() {
    const { pathname } = useLocation();
    const title = getTitleForPath(pathname);

    return (
        <SidebarProvider>
            <AppSidebar />

            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 px-4 bg-white border-b">
                    <SidebarTrigger className="bg-white" />

                    <Separator orientation="vertical" className="h-4" />

                    <div className="text-sm font-medium">{title}</div>

                    <div className="ml-auto text-xs text-muted-foreground">
                        Lokal: api.pharmacy.local
                    </div>
                </header>

                <main className="flex flex-1 flex-col gap-4 p-6">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
