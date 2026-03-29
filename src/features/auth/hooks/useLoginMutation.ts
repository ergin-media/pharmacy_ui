import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../api/auth.api";
import type { AuthLoginPayload } from "../types/auth.types";

export function useLoginMutation() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (payload: AuthLoginPayload) => login(payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["auth", "me"] });
        },
    });
}