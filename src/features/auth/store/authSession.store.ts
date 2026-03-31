import type { AuthUser } from "../types/auth.types";

type AuthSessionState = {
    user: AuthUser | null;
    csrfToken: string | null;
};

let state: AuthSessionState = {
    user: null,
    csrfToken: null,
};

export function getAuthSession() {
    return state;
}

export function setAuthSession(input: {
    user: AuthUser | null;
    csrfToken: string | null;
}) {
    state = {
        user: input.user,
        csrfToken: input.csrfToken,
    };
}

export function clearAuthSession() {
    state = {
        user: null,
        csrfToken: null,
    };
}

export function getCsrfToken() {
    return state.csrfToken;
}

export function getAuthUser() {
    return state.user;
}