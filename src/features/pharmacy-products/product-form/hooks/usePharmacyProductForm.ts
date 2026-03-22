import { useState } from "react";
import type { PharmacyProductDto } from "../../types/pharmacy-products.dto";
import type { PharmacyProductFormValues } from "../types/pharmacy-product-form.types";

export function usePharmacyProductForm(input?: {
    product?: PharmacyProductDto | null;
}) {
    const product = input?.product;

    const [values, setValues] = useState<PharmacyProductFormValues>({
        id: product?.id,

        name: product?.name ?? "",
        product_code: product?.product_code ?? "",

        manufacturer: product?.manufacturer ?? "",
        strain: product?.strain ?? "",

        base_price_cents: product?.prices?.base_price_cents ?? 0,
        price_other_provider_cents:
            product?.prices?.price_other_provider_cents ?? 0,

        currency: product?.currency ?? "EUR",

        is_active: product?.is_active ?? true,
    });

    function patch<K extends keyof PharmacyProductFormValues>(
        key: K,
        value: PharmacyProductFormValues[K],
    ) {
        setValues((prev) => ({
            ...prev,
            [key]: value,
        }));
    }

    return {
        values,
        actions: {
            patch,
        },
    };
}