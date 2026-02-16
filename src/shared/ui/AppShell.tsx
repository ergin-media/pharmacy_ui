import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { getTitleForPath } from "@/shared/nav/nav.helpers";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_SECTIONS } from "@/shared/nav/nav.config";

function NavItem({
    to,
    label,
    onClick,
}: {
    to: string;
    label: string;
    onClick?: () => void;
}) {
    const { pathname } = useLocation();
    const active = pathname === to;

    return (
        <Link
            to={to}
            onClick={onClick}
            className={[
                "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
                active
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
            ].join(" ")}
        >
            {label}
        </Link>
    );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
    return (
        <div className="grid gap-3">
            <div className="px-2 pb-2">
                <div className="text-sm font-semibold">Pharmacy UI</div>
                <div className="text-xs text-muted-foreground">Verwaltung</div>
            </div>

            <Separator />

            <nav className="grid gap-3">
                {NAV_SECTIONS.map((section) => (
                    <div key={section.title} className="grid gap-1">
                        <div className="px-2 pt-1 text-xs font-medium text-muted-foreground">
                            {section.title}
                        </div>
                        {section.items.map((item) => (
                            <NavItem
                                key={item.to}
                                to={item.to}
                                label={item.label}
                                onClick={onNavigate}
                            />
                        ))}
                    </div>
                ))}
            </nav>

            <Separator />

            <div className="px-2 text-xs text-muted-foreground">
                API:{" "}
                <span className="font-medium">
                    {import.meta.env.VITE_API_BASE ?? "/v1/"}
                </span>
            </div>
        </div>
    );
}

export function AppShell() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { pathname } = useLocation();
    const title = getTitleForPath(pathname);

    return (
        <div className="min-h-screen w-full bg-background">
            {/* Full width container */}
            <div className="w-full p-4">
                {/* 25% max sidebar on md+, rest content */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-[250px_1fr]">
                    {/* Desktop Sidebar */}
                    <Card className="hidden h-full p-3 md:block">
                        <SidebarContent />
                    </Card>

                    {/* Main */}
                    <div className="min-w-0">
                        {/* Topbar */}
                        <Card className="mb-4 flex items-center justify-between gap-2 p-3">
                            <div className="flex items-center gap-2">
                                {/* Mobile menu (controlled) */}
                                <div className="md:hidden">
                                    <Sheet
                                        open={mobileOpen}
                                        onOpenChange={setMobileOpen}
                                    >
                                        <SheetTrigger>
                                            <Button variant="outline" size="sm">
                                                Menü
                                            </Button>
                                        </SheetTrigger>

                                        <SheetContent
                                            side="left"
                                            className="w-[320px]"
                                        >
                                            <SheetHeader>
                                                <SheetTitle>
                                                    Navigation
                                                </SheetTitle>
                                            </SheetHeader>

                                            <ScrollArea className="mt-4 h-[calc(100vh-8rem)] pr-2">
                                                <SidebarContent
                                                    onNavigate={() =>
                                                        setMobileOpen(false)
                                                    }
                                                />
                                            </ScrollArea>
                                        </SheetContent>
                                    </Sheet>
                                </div>

                                <div className="text-sm font-medium">
                                    {title}
                                </div>
                            </div>

                            <div className="text-xs text-muted-foreground">
                                Lokal: api.pharmacy.local
                            </div>
                        </Card>

                        {/* Content */}
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}
