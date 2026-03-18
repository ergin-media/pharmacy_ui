const ERROR_MESSAGES: Record<string, string> = {
    not_found: "Rezept nicht gefunden",
    offer_not_found: "Angebot nicht gefunden",

    payment_not_markable: "Zahlung kann aktuell nicht bestätigt werden",
    offer_not_created: "Angebot wurde noch nicht erstellt",
    offer_not_sent: "Angebot wurde noch nicht versendet",

    already_paid_or_invalid_payment_state:
        "Zahlung bereits bestätigt oder ungültiger Status",
    already_paid: "Zahlung wurde bereits bestätigt",

    mark_paid_failed_state_conflict: "Statuskonflikt – bitte Seite neu laden",
};

export function getMarkPaidErrorMessage(error: unknown): string {
    // Axios Error safe handling
    const err = error as any;

    const code =
        err?.response?.data?.code ?? err?.response?.data?.error ?? null;

    if (code && ERROR_MESSAGES[code]) {
        return ERROR_MESSAGES[code];
    }

    return "Fehler beim Bestätigen der Zahlung";
}
