import { useQueryClient } from "@tanstack/react-query";

import { useToastMutation } from "@/shared/lib/react-query/create-toast-mutation";
import { rxKeys } from "../../queries/rx.queries";
import { sendRxOffer } from "../api/rx-offer-send.api";

export function useSendOfferMutation() {
    const queryClient = useQueryClient();

    return useToastMutation({
        mutationFn: sendRxOffer,
        toastMessages: {
            loading: "Angebot wird versendet...",
            success: "Angebot erfolgreich versendet",
            error: "Angebot konnte nicht versendet werden",
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: rxKeys.lists(),
            });
        },
    });
}
