import { Link, Outlet, useLocation } from "react-router";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { NAV_SECTIONS } from "@/shared/nav/nav.config.ts";

function NavItem({ to, label }: { to: string; label: string }) {
    const { pathname } = useLocation();
    const active = pathname === to;

    return (
        <Link
            to={to}
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

export function AppShell() {
    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto grid max-w-[1400px] grid-cols-[260px_1fr] gap-4 p-4">
                {/* Sidebar */}
                <Card className="h-[calc(100vh-2rem)] p-3">
                    <div className="px-2 pb-2">
                        <div className="text-sm font-semibold">Pharmacy UI</div>
                        <div className="text-xs text-muted-foreground">
                            Verwaltung
                        </div>
                    </div>

                    <Separator className="my-2" />

                    <nav className="grid gap-3 px-1">
                        {NAV_SECTIONS.map((section) => (
                            <div key={section.title} className="grid gap-1">
                                <div className="px-2 pt-2 text-xs font-medium text-muted-foreground">
                                    {section.title}
                                </div>
                                {section.items.map((item) => (
                                    <NavItem
                                        key={item.to}
                                        to={item.to}
                                        label={item.label}
                                    />
                                ))}
                            </div>
                        ))}
                    </nav>

                    <Separator className="my-3" />

                    <div className="px-2 text-xs text-muted-foreground">
                        API:{" "}
                        <span className="font-medium">
                            {import.meta.env.VITE_API_BASE ?? "/v1/"}
                        </span>
                    </div>
                </Card>

                {/* Main */}
                <div className="min-w-0">
                    {/* Topbar */}
                    <Card className="mb-4 flex items-center justify-between p-3">
                        <div className="text-sm font-medium">Dashboard</div>
                        <div className="text-xs text-muted-foreground">
                            Lokal: api.pharmacy.local
                        </div>
                    </Card>

                    {/* Content */}
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
