import type { RxManualCreateFormValues } from "../types/rx-manual-create.types";

export function buildManualRxFormData(
    values: RxManualCreateFormValues,
): FormData {
    const formData = new FormData();

    formData.append("patient_first_name", values.patientFirstName.trim());
    formData.append("patient_last_name", values.patientLastName.trim());
    formData.append("patient_street", values.patientStreet.trim());
    formData.append("patient_zip", values.patientZip.trim());
    formData.append("patient_city", values.patientCity.trim());
    formData.append("patient_email", values.patientEmail.trim());
    formData.append("patient_phone", values.patientPhone.trim());

    formData.append("issue_date", values.issueDate);
    formData.append("notes", values.notes.trim());

    formData.append(
        "items",
        JSON.stringify(
            values.items.map((item) => ({
                pharmacy_product_id: item.pharmacyProductId,
                quantity: item.quantity,
                unit: item.unit,
            })),
        ),
    );

    if (values.documentFile) {
        formData.append("file", values.documentFile);
    }

    return formData;
}
