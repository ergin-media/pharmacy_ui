import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

import { useAuth } from "./useAuth";
import { useLoginMutation } from "./useLoginMutation";

type LoginLocationState = {
    from?: string;
};

export function useLoginPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const auth = useAuth();
    const loginMutation = useLoginMutation();

    const state = location.state as LoginLocationState | null;
    const redirectTo = state?.from || "/";

    useEffect(() => {
        if (auth.isAuthenticated) {
            navigate("/", { replace: true });
        }
    }, [auth.isAuthenticated, navigate]);

    async function submit(input: { email: string; password: string }) {
        await loginMutation.mutateAsync(input);
        navigate(redirectTo, { replace: true });
    }

    return {
        isPageLoading: auth.isLoading,
        isSubmitting: loginMutation.isPending,
        actions: {
            submit,
        },
    };
}