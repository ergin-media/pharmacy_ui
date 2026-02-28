import { api } from "@/shared/api/axios";
import type { DashboardQueryParams, DashboardResponseDto } from "../types/dashboard.dto";

export async function fetchDashboard(params: DashboardQueryParams = {}) {
    const res = await api.get<DashboardResponseDto>("dashboard", { params });
    return res.data;
}