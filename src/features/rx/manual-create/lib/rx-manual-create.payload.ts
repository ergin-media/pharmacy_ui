import type { RxManualCreateFormValues } from "../types/rx-manual-create.types";

export function buildManualRxFormData(
    values: RxManualCreateFormValues,
): FormData {
    const formData = new FormData();

    // Patient
    formData.append("patient_first_name", values.patientFirstName);
    formData.append("patient_last_name", values.patientLastName);
    formData.append("patient_street", values.patientStreet);
    formData.append("patient_zip", values.patientZip);
    formData.append("patient_city", values.patientCity);

    // Items (als JSON serialisieren)
    formData.append(
        "items",
        JSON.stringify(
            values.items.map((item) => ({
                pharmacy_product_id: item.pharmacyProductId,
                label: item.label,
                quantity: item.quantity,
                unit: item.unit,
            })),
        ),
    );

    // Datei
    if (values.file) {
        formData.append("file", values.file);
    }

    return formData;
}