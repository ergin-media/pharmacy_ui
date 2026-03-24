import { AlertCircle } from "lucide-react";

import { Card } from "@/components/ui/card";

export function PharmacyProductsImportHeaderIssues(props: {
    previewError: string | null;
    missingColumns: string[];
    foundColumns: string[];
    unknownColumns: string[];
    allowedColumns: string[];
}) {
    const {
        previewError,
        missingColumns,
        foundColumns,
        unknownColumns,
        allowedColumns,
    } = props;

    const hasIssues =
        Boolean(previewError) ||
        missingColumns.length > 0 ||
        foundColumns.length > 0 ||
        unknownColumns.length > 0 ||
        allowedColumns.length > 0;

    if (!hasIssues) return null;

    return (
        <Card className="gap-4 p-4">
            {previewError ? (
                <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                    <div>{previewError}</div>
                </div>
            ) : null}

            {(missingColumns.length > 0 ||
                foundColumns.length > 0 ||
                unknownColumns.length > 0 ||
                allowedColumns.length > 0) && (
                <div className="space-y-4">
                    {missingColumns.length > 0 ? (
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">
                                Die Pflichtspalten dürfen nicht fehlen:
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {missingColumns.map((column) => (
                                    <span
                                        key={column}
                                        className="rounded-md border border-destructive/20 bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive"
                                    >
                                        {column}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {unknownColumns.length > 0 ? (
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">
                                Diese Spalten werden nicht erkannt:
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {unknownColumns.map((column) => (
                                    <span
                                        key={column}
                                        className="rounded-md border border-amber-300 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
                                    >
                                        {column}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {foundColumns.length > 0 ? (
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">
                                Gefundene Spalten in der Datei:
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {foundColumns.map((column) => (
                                    <span
                                        key={column}
                                        className="rounded-md border border-border bg-muted px-2 py-1 text-xs text-foreground"
                                    >
                                        {column}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {allowedColumns.length > 0 && unknownColumns.length > 0 ? (
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">
                                Erlaubte Spalten:
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {allowedColumns.map((column) => (
                                    <span
                                        key={column}
                                        className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
                                    >
                                        {column}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            )}
        </Card>
    );
}
