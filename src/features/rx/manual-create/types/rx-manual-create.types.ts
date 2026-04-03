import type { RxItem } from "../../types/rx.dto";

export type RxManualCreateItem = {
    id: number;
    pharmacyProductId: number | null;
    productName: string;
    quantity: NonNullable<RxItem["quantity"]>;
    unit: NonNullable<RxItem["unit"]>;
    calculatedUnitPriceCents: number | null;
};

export type RxManualCreateFormValues = {
    issueDate: string;

    patientFirstName: string;
    patientLastName: string;
    patientStreet: string;
    patientZip: string;
    patientCity: string;
    patientEmail: string;
    patientPhone: string;

    notes: string;

    items: RxManualCreateItem[];

    documentFile: File | null;
    documentPreviewUrl: string | null;
    documentMimeType: string | null;
};