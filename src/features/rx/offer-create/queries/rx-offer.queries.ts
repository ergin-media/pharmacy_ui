import { useQueryClient } from "@tanstack/react-query";

import { useToastMutation } from "@/shared/lib/react-query/create-toast-mutation";
import { rxKeys } from "../../queries/rx.queries";
import { createRxOffer } from "../api/rx.offer.types";

export function useCreateOfferMutation() {
    const queryClient = useQueryClient();

    return useToastMutation({
        mutationFn: createRxOffer,
        toastMessages: {
            loading: "Angebot wird erstellt...",
            success: "Angebot erfolgreich erstellt",
            error: "Angebot konnte nicht erstellt werden",
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: rxKeys.lists(),
            });
        },
    });
}