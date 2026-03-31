export type AuthUser = {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
    role: string;
};

export type AuthMeResponse = {
    ok: true;
    user: AuthUser;
    csrf_token?: string;
};

export type AuthLoginPayload = {
    email: string;
    password: string;
};

export type AuthLoginResponse = {
    ok: true;
    user: AuthUser;
    csrf_token: string;
};