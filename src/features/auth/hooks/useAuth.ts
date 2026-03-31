import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { getMe } from "../api/auth.api";
import {
    clearAuthSession,
    getAuthSession,
    setAuthSession,
} from "../store/authSession.store";

export function useAuth() {
    const query = useQuery({
        queryKey: ["auth", "me"],
        queryFn: getMe,
        retry: false,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });

    useEffect(() => {
        if (query.data?.user) {
            const current = getAuthSession();

            setAuthSession({
                user: query.data.user,
                csrfToken: query.data.csrf_token ?? current.csrfToken,
            });

            return;
        }

        if (query.isError) {
            clearAuthSession();
        }
    }, [query.data, query.isError]);

    const session = getAuthSession();

    return {
        user: session.user,
        csrfToken: session.csrfToken,
        isAuthenticated: Boolean(session.user),
        isLoading: query.isLoading,
        isError: query.isError,
    };
}