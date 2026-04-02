import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";

import { useAuth } from "../hooks/useAuth";
import { Spinner } from "@/components/ui/spinner";

export function RequireAuth(props: { children: ReactNode }) {
    const { children } = props;
    const location = useLocation();
    const auth = useAuth();

    if (auth.isLoading) {
        return (
            <div className="flex min-h-svh items-center justify-center">
                <Spinner className="h-6 w-6 text-muted-foreground" />
            </div>
        );
    }

    if (!auth.isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: `${location.pathname}${location.search}${location.hash}`,
                }}
            />
        );
    }

    return <>{children}</>;
}