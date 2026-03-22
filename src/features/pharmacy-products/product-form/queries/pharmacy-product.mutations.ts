import { useQueryClient } from "@tanstack/react-query";
import { useToastMutation } from "@/shared/lib/react-query/create-toast-mutation";

import {
    createPharmacyProduct,
    updatePharmacyProduct,
} from "../api/pharmacy-product.api";

import { pharmacyProductsKeys } from "../../queries/pharmacy-products.queries";

export function useCreatePharmacyProductMutation() {
    const qc = useQueryClient();

    return useToastMutation({
        mutationFn: createPharmacyProduct,
        toastMessages: {
            loading: "Artikel wird erstellt...",
            success: "Artikel erstellt",
            error: "Fehler beim Erstellen",
        },
        onSuccess: async () => {
            await qc.invalidateQueries({
                queryKey: pharmacyProductsKeys.all,
            });
        },
    });
}

export function useUpdatePharmacyProductMutation() {
    const qc = useQueryClient();

    return useToastMutation({
        mutationFn: updatePharmacyProduct,
        toastMessages: {
            loading: "Artikel wird gespeichert...",
            success: "Artikel gespeichert",
            error: "Fehler beim Speichern",
        },
        onSuccess: async () => {
            await qc.invalidateQueries({
                queryKey: pharmacyProductsKeys.all,
            });
        },
    });
}