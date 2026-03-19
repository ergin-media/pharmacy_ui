import { useToastMutation } from "@/shared/lib/react-query/create-toast-mutation";
import { createAndSendRxOffer } from "../api/rx-offer.api";

export function useCreateAndSendOfferMutation() {
    return useToastMutation({
        mutationFn: createAndSendRxOffer,
        toastMessages: {
            loading: "Angebot wird erstellt und versendet...",
            success: "Angebot erfolgreich erstellt und versendet",
            error: "Angebot konnte nicht erstellt und versendet werden",
        },
    });
}
