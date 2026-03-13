import { useMemo, useState } from "react";
import type { RxListItemDto } from "../../types/rx.dto";
import type {
    RxOfferFormItem,
    RxOfferFormValues,
} from "../types/rx.offer.types";
import { createOfferNumberFromRxId } from "../lib/rx-offer-number";

function toDateInputValue(value?: string | null) {
    if (!value) return "";
    return String(value).slice(0, 10);
}

function mapItems(rx: RxListItemDto): RxOfferFormItem[] {
    return (rx.items ?? []).map((item, index) => {
        const quantity = Number(item.quantity ?? 0);
        const unit = String(item.unit ?? "g");
        const unitPriceCents = 0;
        const totalPriceCents = quantity * unitPriceCents;

        return {
            id: Number(item.id ?? index + 1),
            label:
                item.raw_product_name ??
                item.normalized_product_name ??
                item.sku ??
                "—",
            quantity,
            unit,
            unitPriceCents,
            totalPriceCents,
        };
    });
}

function sum(items: RxOfferFormItem[]) {
    return items.reduce((acc, item) => acc + item.totalPriceCents, 0);
}

function createEmptyItem(nextId: number): RxOfferFormItem {
    return {
        id: nextId,
        label: "",
        quantity: 1,
        unit: "g",
        unitPriceCents: 0,
        totalPriceCents: 0,
    };
}

export function useRxOfferForm(rx: RxListItemDto) {
    const initialItems = useMemo(() => mapItems(rx), [rx]);
    const initialSubtotal = useMemo(() => sum(initialItems), [initialItems]);

    const [values, setValues] = useState<RxOfferFormValues>({
        rxId: Number(rx.id),
        offerNumber: createOfferNumberFromRxId(Number(rx.id)),
        currency: rx.summary?.currency ?? "EUR",
        issueDate: toDateInputValue(new Date().toISOString()),
        patientFirstName: rx.patient?.first_name ?? "",
        patientLastName: rx.patient?.last_name ?? "",
        patientStreet: rx.patient?.street ?? "",
        patientZip: rx.patient?.zip ?? "",
        patientCity: rx.patient?.city ?? "",
        items: initialItems.length > 0 ? initialItems : [createEmptyItem(1)],
        subtotalCents: initialSubtotal,
        shippingCents: 0,
        totalCents: initialSubtotal,
        notes: "",
    });

    function recalculate(next: RxOfferFormValues): RxOfferFormValues {
        const subtotalCents = sum(next.items);
        const totalCents = subtotalCents + next.shippingCents;

        return {
            ...next,
            subtotalCents,
            totalCents: Math.max(0, totalCents),
        };
    }

    function patch<K extends keyof RxOfferFormValues>(
        key: K,
        value: RxOfferFormValues[K],
    ) {
        setValues((prev) => recalculate({ ...prev, [key]: value }));
    }

    function updateItem(itemId: number, patchData: Partial<RxOfferFormItem>) {
        setValues((prev) => {
            const items = prev.items.map((item) => {
                if (item.id !== itemId) return item;

                const nextItem = {
                    ...item,
                    ...patchData,
                };

                return {
                    ...nextItem,
                    totalPriceCents:
                        nextItem.quantity * nextItem.unitPriceCents,
                };
            });

            return recalculate({
                ...prev,
                items,
            });
        });
    }

    function addItem() {
        setValues((prev) => {
            const maxId = prev.items.reduce(
                (acc, item) => Math.max(acc, item.id),
                0,
            );

            return recalculate({
                ...prev,
                items: [...prev.items, createEmptyItem(maxId + 1)],
            });
        });
    }

    function removeItem(itemId: number) {
        setValues((prev) => {
            if (prev.items.length <= 1) return prev;

            return recalculate({
                ...prev,
                items: prev.items.filter((item) => item.id !== itemId),
            });
        });
    }

    return {
        values,
        actions: {
            patch,
            updateItem,
            addItem,
            removeItem,
        },
    };
}
