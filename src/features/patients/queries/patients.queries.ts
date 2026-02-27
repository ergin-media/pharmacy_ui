import { useQuery } from "@tanstack/react-query";
import type { PatientsListParams } from "../types/patients.list.dto";
import { fetchPatients } from "../api/patients.api";

export const patientsKeys = {
    all: ["patients"] as const,
    list: (params: PatientsListParams) =>
        [...patientsKeys.all, "list", params] as const,
};

export function usePatientsListQuery(params: PatientsListParams) {
    return useQuery({
        queryKey: patientsKeys.list(params),
        queryFn: () => fetchPatients(params),
        staleTime: 10_000,
    });
}
