export const RX_PROVIDERS = [
    { slug: "dransay", name: "DrAnsay" },
    { slug: "drabc", name: "DoktorABC" },
    { slug: "weed-de", name: "Weed.de" },
    { slug: "aachener-blueten", name: "Aachener Blüten" },
    { slug: "cannurexa-ltd", name: "Cannurexa" },
] as const;

export type RxProviderSlug = (typeof RX_PROVIDERS)[number]["slug"];
