import { api } from "@/shared/api/axios";
import type {
    PatientsListParams,
    PatientsListResponseDto,
} from "../types/patients.list.dto";

export async function fetchPatients(
    params: PatientsListParams,
): Promise<PatientsListResponseDto> {
    // wenn du keinen apiGet helper hast: einfach fetch(...) wie in deinen anderen APIs
    return api("patients", { params });
}
