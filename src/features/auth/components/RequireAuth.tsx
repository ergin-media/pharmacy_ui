import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";

import { useAuth } from "../hooks/useAuth";

export function RequireAuth(props: { children: ReactNode }) {
    const { children } = props;
    const location = useLocation();
    const auth = useAuth();

    if (auth.isLoading) {
        return (
            <div className="flex min-h-svh items-center justify-center">
                <div className="text-sm text-muted-foreground">Lade…</div>
            </div>
        );
    }

    if (!auth.isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    return <>{children}</>;
}