export function formatDateTime(value?: string | null): string {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    const datePart = new Intl.DateTimeFormat("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);

    const timePart = new Intl.DateTimeFormat("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);

    return `${datePart} - ${timePart} Uhr`;
}
