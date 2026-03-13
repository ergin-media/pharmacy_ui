export type RxOfferFormItem = {
    id: number;
    label: string;
    quantity: number;
    unit: string;
    unitPriceCents: number;
    totalPriceCents: number;
};

export type RxOfferFormValues = {
    rxId: number;
    offerNumber: string;
    currency: string;
    issueDate: string;
    patientFirstName: string;
    patientLastName: string;
    patientStreet: string;
    patientZip: string;
    patientCity: string;
    items: RxOfferFormItem[];
    subtotalCents: number;
    shippingCents: number;
    totalCents: number;
    notes: string;
};
