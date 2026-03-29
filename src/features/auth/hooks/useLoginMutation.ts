import { useQueryClient } from "@tanstack/react-query";
import { login } from "../api/auth.api";
import type { AuthLoginPayload } from "../types/auth.types";
import { useToastMutation } from "@/shared/lib/react-query/create-toast-mutation";

export function useLoginMutation() {
    const qc = useQueryClient();

    return useToastMutation({
        mutationFn: (payload: AuthLoginPayload) => login(payload),

        toastMessages: {
            loading: "Login wird durchgeführt...",
            success: "Erfolgreich eingeloggt",
            error: "Login fehlgeschlagen",
        },

        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ["auth", "me"] });
        },
    });
}