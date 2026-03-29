import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppBreadcrumb } from "./AppBreadcrumb";
import { Outlet } from "react-router";
import { AppSidebar } from "./AppSidebar";
import { AppUserMenu } from "@/features/auth/components/AppUserMenu";

export function AppShell() {
    return (
        <SidebarProvider>
            <AppSidebar />

            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
                    <SidebarTrigger className="bg-white" />

                    <Separator orientation="vertical" className="h-4" />

                    <AppBreadcrumb />

                    <div className="ml-auto">
                        <AppUserMenu />
                    </div>
                </header>

                <main className="flex flex-1 flex-col p-4">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}