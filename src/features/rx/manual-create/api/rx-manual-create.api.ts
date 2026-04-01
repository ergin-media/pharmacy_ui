import { api } from "@/shared/api/axios";

export async function createManualRx(formData: FormData) {
    const response = await api.post("/rx/manual-create", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
}