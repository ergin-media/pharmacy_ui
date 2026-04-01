import { useQueryClient } from "@tanstack/react-query";
import { createManualRx } from "../api/rx-manual-create.api";
import { useToastMutation } from "@/shared/lib/react-query/create-toast-mutation";

export function useCreateManualRxMutation() {
    const queryClient = useQueryClient();

    return useToastMutation({
        mutationFn: createManualRx,
        toastMessages: {
            loading: "Rezept wird angelegt...",
            success: "Rezept erfolgreich angelegt",
            error: "Rezept konnte nicht angelegt werden",
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["rx", "list"],
            });
        },
    });
}