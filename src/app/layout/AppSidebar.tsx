import { NAV_SECTIONS } from "@/shared/nav/nav.config";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { NavMain } from "./NavMain";

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent>
                <NavMain label="Navigation" items={NAV_SECTIONS} />
            </SidebarContent>
        </Sidebar>
    );
}
