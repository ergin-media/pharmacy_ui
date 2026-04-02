import axios from "axios";
import {
    clearAuthSession,
    getCsrfToken,
} from "@/features/auth/store/authSession.store";

const baseURL = import.meta.env.VITE_API_BASE ?? "/v1/";

export const api = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 30_000,
});

function isAuthRoute(url?: string) {
    if (!url) return false;

    return (
        url.includes("/auth/login") ||
        url.includes("/auth/logout") ||
        url.includes("/auth/me")
    );
}

function isWriteMethod(method?: string) {
    if (!method) return false;

    const normalized = method.toUpperCase();

    return (
        normalized === "POST" ||
        normalized === "PUT" ||
        normalized === "PATCH" ||
        normalized === "DELETE"
    );
}

function isLoginRoute(url?: string) {
    if (!url) return false;
    return url.includes("/auth/login");
}

let hasShownSessionExpiredToast = false;
let hasShownCsrfToast = false;

api.interceptors.request.use((config) => {
    const method = config.method;
    const requestUrl = config.url;

    if (isWriteMethod(method) && !isLoginRoute(requestUrl)) {
        const csrfToken = getCsrfToken();

        if (csrfToken) {
            config.headers = config.headers ?? {};
            config.headers["X-CSRF-Token"] = csrfToken;
        }
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const requestUrl = error?.config?.url;
        const errorCode = error?.response?.data?.error?.code;

        if (status === 401 && !isAuthRoute(requestUrl)) {
            clearAuthSession();

            if (!hasShownSessionExpiredToast) {
                hasShownSessionExpiredToast = true;

                import("sonner").then(({ toast }) => {
                    toast.info("Sitzung abgelaufen. Bitte neu einloggen.");
                });

                window.setTimeout(() => {
                    hasShownSessionExpiredToast = false;
                }, 1500);
            }

            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }

        if (
            status === 403 &&
            (errorCode === "missing_csrf_token" ||
                errorCode === "invalid_csrf_token" ||
                errorCode === "csrf_blocked")
        ) {
            if (!hasShownCsrfToast) {
                hasShownCsrfToast = true;

                import("sonner").then(({ toast }) => {
                    toast.error(
                        "Sicherheitsprüfung fehlgeschlagen. Bitte erneut einloggen.",
                    );
                });

                window.setTimeout(() => {
                    hasShownCsrfToast = false;
                }, 1500);
            }

            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    },
);
