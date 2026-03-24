export function PharmacyProductsImportSummaryCards(props: {
    summary: {
        total_rows: number;
        valid_rows: number;
        invalid_rows: number;
    } | null;
}) {
    const { summary } = props;

    if (!summary) return null;

    return (
        <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-lg bg-white p-4">
                <div className="text-xs text-muted-foreground">
                    Gesamtzeilen
                </div>
                <div className="mt-1 text-2xl font-semibold">
                    {summary.total_rows}
                </div>
            </div>

            <div className="rounded-lg bg-white p-4">
                <div className="text-xs text-muted-foreground">Gültig</div>
                <div className="mt-1 text-2xl font-semibold text-green-600">
                    {summary.valid_rows}
                </div>
            </div>

            <div className="rounded-lg bg-white p-4">
                <div className="text-xs text-muted-foreground">Fehlerhaft</div>
                <div className="mt-1 text-2xl font-semibold text-destructive">
                    {summary.invalid_rows}
                </div>
            </div>
        </div>
    );
}
