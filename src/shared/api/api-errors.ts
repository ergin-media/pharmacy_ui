import axios from "axios";

export type ApiErrorInfo = {
    status: number | null;
    code: string | null;
    message: string | null;
};

export function getApiErrorInfo(error: unknown): ApiErrorInfo {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as
            | {
                  code?: unknown;
                  error?: unknown;
                  message?: unknown;
              }
            | undefined;

        const code =
            typeof data?.code === "string"
                ? data.code
                : typeof data?.error === "string"
                  ? data.error
                  : null;

        const message =
            typeof data?.message === "string" ? data.message : error.message;

        return {
            status: error.response?.status ?? null,
            code,
            message: message ?? null,
        };
    }

    if (error instanceof Error) {
        return {
            status: null,
            code: null,
            message: error.message,
        };
    }

    return {
        status: null,
        code: null,
        message: null,
    };
}

export function getApiErrorMessage(
    error: unknown,
    input?: {
        fallback?: string;
        codeMap?: Record<string, string>;
        statusMap?: Record<number, string>;
    },
): string {
    const info = getApiErrorInfo(error);

    if (info.code && input?.codeMap?.[info.code]) {
        return input.codeMap[info.code];
    }

    if (typeof info.status === "number" && input?.statusMap?.[info.status]) {
        return input.statusMap[info.status];
    }

    if (info.message) {
        return info.message;
    }

    return input?.fallback ?? "Ein unerwarteter Fehler ist aufgetreten";
}
