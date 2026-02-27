import { api } from "@/shared/api/axios";
import type {
    PatientsListParams,
    PatientsListResponseDto,
} from "../types/patients.list.dto";

export async function fetchPatients(params: PatientsListParams) {
    const res = await api.get<PatientsListResponseDto>("patients", {
        params,
    });
    return res.data;
}
