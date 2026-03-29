import axios from "axios";

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

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const requestUrl = error?.config?.url;

        if (status === 401 && !isAuthRoute(requestUrl)) {
            const isOnLoginPage = window.location.pathname === "/login";

            if (!isOnLoginPage) {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    },
);