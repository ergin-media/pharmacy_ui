import { useToastMutation } from "@/shared/lib/react-query/create-toast-mutation";
import { sendRxOffer } from "../api/rx-offer-send.api";

export function useSendOfferMutation() {
    return useToastMutation({
        mutationFn: sendRxOffer,
        toastMessages: {
            loading: "Angebot wird versendet...",
            success: "Angebot erfolgreich versendet",
            error: "Angebot konnte nicht versendet werden",
        },
    });
}
