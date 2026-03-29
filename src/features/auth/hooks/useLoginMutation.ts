import { useQueryClient } from "@tanstack/react-query";
import type { AuthLoginPayload, AuthLoginResponse } from "../types/auth.types";
import { login } from "../api/auth.api";
import { useToastMutation } from "@/shared/lib/react-query/create-toast-mutation";

export function useLoginMutation() {
    const queryClient = useQueryClient();

    return useToastMutation({
        mutationFn: (payload: AuthLoginPayload) => login(payload),
        toastMessages: {
            loading: "Login wird durchgeführt...",
            success: "Erfolgreich eingeloggt",
            error: "Login fehlgeschlagen",
        },
        onSuccess: async (data: AuthLoginResponse) => {
            queryClient.setQueryData(["auth", "me"], data);

            await queryClient.invalidateQueries({
                queryKey: ["auth", "me"],
                refetchType: "none",
            });
        },
    });
}