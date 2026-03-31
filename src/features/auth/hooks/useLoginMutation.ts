import { useQueryClient } from "@tanstack/react-query";

import { login } from "../api/auth.api";
import type { AuthLoginPayload, AuthLoginResponse } from "../types/auth.types";
import { setAuthSession } from "../store/authSession.store";

import { useToastMutation } from "@/shared/lib/react-query/create-toast-mutation";

export function useLoginMutation() {
    const queryClient = useQueryClient();

    return useToastMutation({
        mutationFn: (payload: AuthLoginPayload) => login(payload),
        toastMessages: {
            loading: "Login wird durchgeführt...",
            error: "Login fehlgeschlagen",
        },
        onSuccess: async (data: AuthLoginResponse) => {
            setAuthSession({
                user: data.user,
                csrfToken: data.csrf_token,
            });

            queryClient.setQueryData(["auth", "me"], {
                ok: true,
                user: data.user,
                csrf_token: data.csrf_token,
            });

            await queryClient.invalidateQueries({
                queryKey: ["auth", "me"],
                refetchType: "none",
            });
        },
    });
}