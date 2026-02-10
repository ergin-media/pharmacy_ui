import { Link, Outlet, useLocation } from "react-router";

export function AppShell() {
    const { pathname } = useLocation();

    const isActive = (to: string) => (pathname === to ? "underline" : "none");

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "220px 1fr",
                minHeight: "100vh",
            }}
        >
            <aside
                style={{
                    padding: 16,
                    borderRight: "1px solid rgba(255,255,255,0.1)",
                }}
            >
                <div style={{ fontWeight: 700, marginBottom: 12 }}>
                    Pharmacy UI
                </div>
                <nav style={{ display: "grid", gap: 8 }}>
                    <Link to="/rx" style={{ textDecoration: isActive("/rx") }}>
                        RX
                    </Link>
                </nav>
            </aside>

            <main style={{ minWidth: 0 }}>
                <Outlet />
            </main>
        </div>
    );
}
