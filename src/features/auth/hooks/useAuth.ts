import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/auth.api";

export function useAuth() {
    const query = useQuery({
        queryKey: ["auth", "me"],
        queryFn: getMe,
        retry: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
        staleTime: 5 * 60 * 1000, // 5 Minuten
    });

    return {
        user: query.data?.user ?? null,
        isAuthenticated: Boolean(query.data?.user),
        isLoading: query.isLoading,
        isError: query.isError,
    };
}