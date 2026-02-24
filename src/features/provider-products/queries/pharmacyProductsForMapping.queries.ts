import { usePharmacyProductsListQuery } from "@/features/pharmacy-products/queries/pharmacy-products.queries";

export function usePharmacyProductsForMappingQuery() {
    return usePharmacyProductsListQuery({
        page: 1,
        per_page: 100,
        // wichtig: alle, inkl aktiv/inaktiv
        sort: "name_asc",
        // optional: search nicht serverseitig, weil du client-side suchst
    });
}