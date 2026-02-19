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

function isActivePath(pathname: string, to: string) {
    if (pathname === to) return true;
    if (to !== "/" && pathname.startsWith(to + "/")) return true;
    return false;
}

export function NavMain(props: { label?: string; items: NavItem[] }) {
    const { label = "Menü", items } = props;

    const { pathname } = useLocation();
    const navigate = useNavigate();

    // Nur UI-State: welche Parent-Menüs sind aufgeklappt?
    const [openIds, setOpenIds] = useState<Record<string, boolean>>({});

    function toggle(id: string) {
        setOpenIds((s) => ({ ...s, [id]: !s[id] }));
    }

    return (
        <SidebarGroup>
            <SidebarGroupLabel>{label}</SidebarGroupLabel>

            <SidebarMenu>
                {items.map((item) => {
                    const active = isActivePath(pathname, item.to);
                    const hasChildren =
                        Array.isArray(item.items) && item.items.length > 0;

                    const Icon = item.icon as IconLike | undefined;

                    // Default: wenn Route aktiv ist, soll es offen sein.
                    const isOpen = active || Boolean(openIds[item.id]);

                    return (
                        <SidebarMenuItem key={item.id}>
                            <SidebarMenuButton
                                isActive={active}
                                disabled={item.disabled}
                                className="flex items-center gap-2"
                                onClick={() => {
                                    if (item.disabled) return;

                                    if (hasChildren) {
                                        toggle(item.id);
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
                                        const subActive = isActivePath(
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
