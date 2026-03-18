export const MARK_PAID_ERROR_MESSAGES: Record<string, string> = {
    not_found: "Rezept nicht gefunden",
    offer_not_found: "Angebot nicht gefunden",
    payment_not_markable: "Zahlung kann aktuell nicht bestätigt werden",
    offer_not_created: "Angebot wurde noch nicht erstellt",
    offer_not_sent: "Angebot wurde noch nicht versendet",
    already_paid_or_invalid_payment_state:
        "Zahlung bereits bestätigt oder ungültiger Zahlungsstatus",
    already_paid: "Zahlung wurde bereits bestätigt",
    mark_paid_failed_state_conflict: "Statuskonflikt – bitte Seite neu laden",
};
