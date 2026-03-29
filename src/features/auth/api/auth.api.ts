import { api } from "@/shared/api/axios";
import type {
    AuthLoginPayload,
    AuthLoginResponse,
    AuthMeResponse,
} from "../types/auth.types";

export async function login(payload: AuthLoginPayload) {
    const { data } = await api.post<AuthLoginResponse>(
        "/auth/login",
        payload,
        { withCredentials: true },
    );
    return data;
}

export async function logout() {
    const { data } = await api.post(
        "/auth/logout",
        {},
        { withCredentials: true },
    );
    return data;
}

export async function getMe() {
    const { data } = await api.get<AuthMeResponse>("/auth/me", {
        withCredentials: true,
    });
    return data;
}