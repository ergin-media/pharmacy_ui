import { api } from "@/shared/api/axios";

export async function createManualRx(formData: FormData) {
    const { data } = await api.post("/rx/manual-create", formData);

    return data;
}
