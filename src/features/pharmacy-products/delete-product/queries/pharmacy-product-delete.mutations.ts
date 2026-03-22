import { useQueryClient } from "@tanstack/react-query";

import { useToastMutation } from "@/shared/lib/react-query/create-toast-mutation";
import { pharmacyProductsKeys } from "../../queries/pharmacy-products.queries";
import { deletePharmacyProduct } from "../api/pharmacy-product-delete.api";

export function useDeletePharmacyProductMutation() {
    const queryClient = useQueryClient();

    return useToastMutation({
        mutationFn: deletePharmacyProduct,
        toastMessages: {
            loading: "Artikel wird gelöscht...",
            success: "Artikel gelöscht",
            error: "Artikel konnte nicht gelöscht werden",
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: pharmacyProductsKeys.all,
            });
        },
    });
}