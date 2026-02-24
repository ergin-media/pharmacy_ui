export function spGetString(sp: URLSearchParams, key: string): string {
    return (sp.get(key) ?? "").trim();
}

export function spGetInt(sp: URLSearchParams, key: string, fallback: number) {
    const raw = sp.get(key);
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

export function spSetInt(sp: URLSearchParams, key: string, value: number) {
    sp.set(key, String(value));
}

export function spSetOrDelete(
    sp: URLSearchParams,
    key: string,
    value?: string,
) {
    const v = (value ?? "").trim();
    if (v) sp.set(key, v);
    else sp.delete(key);
}
