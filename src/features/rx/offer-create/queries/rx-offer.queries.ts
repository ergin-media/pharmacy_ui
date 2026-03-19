import { useToastMutation } from "@/shared/lib/react-query/create-toast-mutation";
import { createRxOffer } from "../api/rx-offer.api";

export function useCreateOfferMutation() {
    return useToastMutation({
        mutationFn: createRxOffer,
        toastMessages: {
            loading: "Angebot wird erstellt...",
            success: "Angebot erfolgreich erstellt",
            error: "Angebot konnte nicht erstellt werden",
        },
    });
}
