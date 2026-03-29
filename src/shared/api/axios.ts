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

let hasShownSessionExpiredToast = false;

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const requestUrl = error?.config?.url;

        if (status === 401 && !isAuthRoute(requestUrl)) {
            if (!hasShownSessionExpiredToast) {
                hasShownSessionExpiredToast = true;

                // lazy import damit kein circular stuff entsteht
                import("sonner").then(({ toast }) => {
                    toast.info("Sitzung abgelaufen. Bitte neu einloggen.");
                });
            }

            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    },
);