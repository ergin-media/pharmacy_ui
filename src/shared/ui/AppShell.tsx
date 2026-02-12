import { Link, Outlet, useLocation } from "react-router";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
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
    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-[1400px] p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-[260px_1fr]">
                    {/* Desktop Sidebar */}
                    <Card className="hidden h-[calc(100vh-2rem)] p-3 md:block">
                        <SidebarContent />
                    </Card>

                    {/* Main */}
                    <div className="min-w-0">
                        {/* Topbar */}
                        <Card className="mb-4 flex items-center justify-between gap-2 p-3">
                            <div className="flex items-center gap-2">
                                {/* Mobile menu */}
                                <div className="md:hidden">
                                    <Sheet>
                                        <SheetTrigger asChild>
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

                                            <div className="mt-4">
                                                {/* Close sheet on navigate */}
                                                {/* Sheet closes automatically on route change in many cases,
                            but we still pass onNavigate to be explicit. */}
                                                <SidebarContent />
                                            </div>
                                        </SheetContent>
                                    </Sheet>
                                </div>

                                <div className="text-sm font-medium">
                                    Dashboard
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
