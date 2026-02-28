// src/features/dashboard/api/dashboard.api.ts
import { api } from "@/shared/api/axios";
import type { DashboardDto } from "../types/dashboard.dto";

export async function fetchDashboard() {
    const res = await api.get<DashboardDto>("dashboard");
    return res.data;
}