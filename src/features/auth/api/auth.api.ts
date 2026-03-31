import { api } from "@/shared/api/axios";
import type {
    AuthLoginPayload,
    AuthLoginResponse,
    AuthMeResponse,
} from "../types/auth.types";

type ApiErrorResponse = {
    ok: false;
    error?: {
        code?: string;
        message?: string;
        details?: unknown;
    };
};

function isApiErrorResponse(data: unknown): data is ApiErrorResponse {
    return (
        typeof data === "object" &&
        data !== null &&
        "ok" in data &&
        (data as { ok?: unknown }).ok === false
    );
}

function assertOk<T>(data: T | ApiErrorResponse): T {
    if (isApiErrorResponse(data)) {
        throw new Error(data.error?.message || "Request failed");
    }

    return data as T;
}

export async function login(payload: AuthLoginPayload) {
    const { data } = await api.post<AuthLoginResponse | ApiErrorResponse>(
        "/auth/login",
        payload,
    );

    return assertOk(data);
}

export async function logout() {
    const { data } = await api.post<{ ok: true } | ApiErrorResponse>(
        "/auth/logout",
        {},
    );

    return assertOk(data);
}

export async function getMe() {
    const { data } = await api.get<AuthMeResponse | ApiErrorResponse>(
        "/auth/me",
    );

    return assertOk(data);
}