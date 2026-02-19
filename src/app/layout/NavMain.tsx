import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router";

import type { NavItem } from "@/shared/nav/nav.types";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";

type IconLike = React.ComponentType<{ className?: string }>;

function isExactPath(pathname: string, to: string) {
    return pathname === to;
}

/**
 * Parent ist aktiv, wenn:
 * - selbst exakt aktiv
 * - oder ein Child exakt aktiv
 */
function isParentActive(pathname: string, item: NavItem) {
    if (isExactPath(pathname, item.to)) return true;
    if (!item.items?.length) return false;
    return item.items.some((child) => isExactPath(pathname, child.to));
}

/**
 * Für "auto-open" reicht prefix match,
 * damit /products/mapping das Produkte-Menü standardmäßig aufklappt.
 */
function isSectionPath(pathname: string, to: string) {
    if (pathname === to) return true;
    if (to !== "/" && pathname.startsWith(to + "/")) return true;
    return false;
}

export function NavMain(props: { label?: string; items: NavItem[] }) {
    const { label = "Menü", items } = props;

    const { pathname } = useLocation();
    const navigate = useNavigate();

    // Manual override für offene Menüs: undefined = noch nie getoggelt (auto)
    const [openIds, setOpenIds] = useState<Record<string, boolean | undefined>>(
        {},
    );

    function toggle(id: string, currentOpen: boolean) {
        setOpenIds((s) => ({ ...s, [id]: !currentOpen }));
    }

    return (
        <SidebarGroup>
            <SidebarGroupLabel>{label}</SidebarGroupLabel>

            <SidebarMenu>
                {items.map((item) => {
                    const hasChildren =
                        Array.isArray(item.items) && item.items.length > 0;

                    const Icon = item.icon as IconLike | undefined;

                    const active = isParentActive(pathname, item);

                    // Auto-Open (Route-basiert)
                    const autoOpen = isSectionPath(pathname, item.to);

                    // Manual override (User klickt)
                    const manualOpen = openIds[item.id];

                    // Wenn manual gesetzt ist, hat das Vorrang, sonst autoOpen
                    const isOpen = manualOpen ?? autoOpen;

                    return (
                        <SidebarMenuItem key={item.id}>
                            <SidebarMenuButton
                                isActive={active}
                                disabled={item.disabled}
                                className="flex items-center gap-2"
                                onClick={() => {
                                    if (item.disabled) return;

                                    if (hasChildren) {
                                        toggle(item.id, isOpen);
                                        return;
                                    }

                                    navigate(item.to);
                                }}
                            >
                                {Icon ? (
                                    <Icon className="size-4 shrink-0" />
                                ) : null}

                                <span className="flex-1">{item.title}</span>

                                {hasChildren ? (
                                    <ChevronRight
                                        className={[
                                            "ml-auto size-4 shrink-0 transition-transform duration-200",
                                            isOpen ? "rotate-90" : "",
                                        ].join(" ")}
                                    />
                                ) : null}
                            </SidebarMenuButton>

                            {hasChildren && isOpen ? (
                                <SidebarMenuSub>
                                    {item.items!.map((sub) => {
                                        const subActive = isExactPath(
                                            pathname,
                                            sub.to,
                                        );
                                        const SubIcon = sub.icon as
                                            | IconLike
                                            | undefined;

                                        return (
                                            <SidebarMenuSubItem key={sub.id}>
                                                <SidebarMenuSubButton
                                                    isActive={subActive}
                                                    className="flex items-center gap-2"
                                                    onClick={() => {
                                                        if (sub.disabled)
                                                            return;
                                                        navigate(sub.to);
                                                    }}
                                                >
                                                    {SubIcon ? (
                                                        <SubIcon className="size-4 shrink-0" />
                                                    ) : null}

                                                    <span className="flex-1">
                                                        {sub.title}
                                                    </span>

                                                    {sub.badge != null ? (
                                                        <span className="text-xs text-muted-foreground">
                                                            {sub.badge}
                                                        </span>
                                                    ) : null}
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        );
                                    })}
                                </SidebarMenuSub>
                            ) : null}
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
