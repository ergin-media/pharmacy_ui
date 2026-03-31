import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { logout } from "../api/auth.api";
import { clearAuthSession } from "../store/authSession.store";

import { useToastMutation } from "@/shared/lib/react-query/create-toast-mutation";

export function useLogoutMutation() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useToastMutation({
        mutationFn: logout,
        toastMessages: {
            loading: "Logout wird durchgeführt...",
            success: "Erfolgreich ausgeloggt",
            error: "Logout fehlgeschlagen",
        },
        onSuccess: async () => {
            clearAuthSession();

            queryClient.setQueryData(["auth", "me"], null);

            await queryClient.invalidateQueries({
                queryKey: ["auth", "me"],
            });

            navigate("/login", { replace: true });
        },
    });
}