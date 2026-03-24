import { useMemo, useRef } from "react";
import { AlertCircle, FileSpreadsheet, Upload } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Card } from "@/components/ui/card";

import { formatMoney } from "@/shared/lib/format/money";

import { usePharmacyProductsImport } from "../hooks/usePharmacyProductsImport";
import { formatImportErrorHeadline } from "../lib/pharmacy-products-import.error-formatters";

function formatPreviewCellValue(
    row: { values: Record<string, string | number | null> },
    column: string,
) {
    const values = row.values;

    const directValue = values[column];

    if (directValue != null) {
        if (
            column === "base_price_cents" ||
            column === "price_other_provider_cents"
        ) {
            return formatMoney(
                typeof directValue === "number" ? directValue : null,
            );
        }

        return String(directValue);
    }

    if (column === "base_price") {
        return formatMoney(
            typeof values.base_price_cents === "number"
                ? values.base_price_cents
                : null,
        );
    }

    if (column === "price_other_provider") {
        return formatMoney(
            typeof values.price_other_provider_cents === "number"
                ? values.price_other_provider_cents
                : null,
        );
    }

    return "—";
}

export function PharmacyProductsImportPanel(props: {
    onCancel: () => void;
    onImported: () => Promise<void> | void;
}) {
    const { onCancel, onImported } = props;

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const vm = usePharmacyProductsImport();

    const errorRows = useMemo(
        () => new Set(vm.errors.map((error) => error.row)),
        [vm.errors],
    );

    async function handleImport() {
        const result = await vm.actions.import();
        if (!result) return;

        await onImported();
    }

    return (
        <div className="flex h-full min-h-0 flex-col">
            <div className="flex flex-1 flex-col gap-3 overflow-auto">
                <Card className="rounded-xl p-6">
                    <div className="flex flex-col items-center justify-center gap-3 text-center">
                        <div className="rounded-full bg-muted p-3">
                            <FileSpreadsheet className="size-6 text-muted-foreground" />
                        </div>

                        <div className="space-y-1">
                            <div className="font-medium">
                                CSV-Datei auswählen
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Unterstützt wird aktuell eine CSV-Datei im
                                erwarteten Importformat.
                            </div>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv,text/csv"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                void vm.actions.preview(file);
                            }}
                        />

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={vm.isPreviewLoading || vm.isImporting}
                            >
                                <Upload className="mr-2 size-4" />
                                Datei auswählen
                            </Button>

                            {vm.file ? (
                                <Button
                                    variant="ghost"
                                    onClick={vm.actions.reset}
                                    disabled={
                                        vm.isPreviewLoading || vm.isImporting
                                    }
                                >
                                    Zurücksetzen
                                </Button>
                            ) : null}
                        </div>

                        {vm.file ? (
                            <div className="text-xs text-muted-foreground">
                                {vm.file.name}
                            </div>
                        ) : null}
                    </div>
                </Card>

                {vm.previewError ||
                vm.missingColumns.length > 0 ||
                vm.foundColumns.length > 0 ||
                vm.unknownColumns.length > 0 ||
                vm.allowedColumns.length > 0 ? (
                    <Card className="gap-4 p-4">
                        {vm.previewError ? (
                            <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                                <div>{vm.previewError}</div>
                            </div>
                        ) : null}

                        {(vm.missingColumns.length > 0 ||
                            vm.foundColumns.length > 0 ||
                            vm.unknownColumns.length > 0 ||
                            vm.allowedColumns.length > 0) && (
                            <div className="space-y-4">
                                {vm.missingColumns.length > 0 ? (
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium text-muted-foreground">
                                            Die Pflichtspalten dürfen nicht
                                            fehlen:
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {vm.missingColumns.map((column) => (
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

                                {vm.unknownColumns.length > 0 ? (
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium text-muted-foreground">
                                            Diese Spalten werden nicht erkannt:
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {vm.unknownColumns.map((column) => (
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

                                {vm.foundColumns.length > 0 ? (
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium text-muted-foreground">
                                            Gefundene Spalten in der Datei:
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {vm.foundColumns.map((column) => (
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

                                {vm.allowedColumns.length > 0 &&
                                vm.unknownColumns.length > 0 ? (
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium text-muted-foreground">
                                            Erlaubte Spalten:
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {vm.allowedColumns.map((column) => (
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
                ) : null}

                {vm.summary ? (
                    <div className="grid gap-3 md:grid-cols-3">
                        <div className="rounded-lg bg-white p-4">
                            <div className="text-xs text-muted-foreground">
                                Gesamtzeilen
                            </div>
                            <div className="mt-1 text-2xl font-semibold">
                                {vm.summary.total_rows}
                            </div>
                        </div>

                        <div className="rounded-lg bg-white p-4">
                            <div className="text-xs text-muted-foreground">
                                Gültig
                            </div>
                            <div className="mt-1 text-2xl font-semibold text-green-600">
                                {vm.summary.valid_rows}
                            </div>
                        </div>

                        <div className="rounded-lg bg-white p-4">
                            <div className="text-xs text-muted-foreground">
                                Fehlerhaft
                            </div>
                            <div className="mt-1 text-2xl font-semibold text-destructive">
                                {vm.summary.invalid_rows}
                            </div>
                        </div>
                    </div>
                ) : null}

                {vm.summary && vm.summary.invalid_rows > 0 ? (
                    <div className="text-sm text-muted-foreground">
                        Zeilen mit Fehlern werden nicht importiert.
                    </div>
                ) : null}

                {vm.errors.length > 0 ? (
                    <Card className="gap-3 p-4">
                        <div className="text-sm font-medium">
                            Fehler in der Datei
                        </div>

                        <div className="max-h-56 overflow-auto rounded-lg border">
                            <div className="divide-y">
                                {vm.errors.map((error, index) => (
                                    <div
                                        key={`${error.row}-${error.field ?? "field"}-${index}`}
                                        className="flex items-start gap-3 p-3 text-sm"
                                    >
                                        <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />

                                        <div className="space-y-0.5">
                                            <div className="font-medium">
                                                {formatImportErrorHeadline(
                                                    error,
                                                )}
                                            </div>

                                            <div className="text-muted-foreground">
                                                {error.message}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                ) : null}

                {vm.hasPreview && vm.columns.length > 0 ? (
                    <Card className="gap-3 p-4">
                        <div className="text-sm font-medium">
                            Vorschau der ersten Zeilen
                        </div>

                        <div className="overflow-auto rounded-lg border">
                            <table className="min-w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr>
                                        {vm.columns.map((column) => (
                                            <th
                                                key={column}
                                                className="whitespace-nowrap px-3 py-2 text-left font-medium"
                                            >
                                                {column}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {vm.preview.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={vm.columns.length}
                                                className="px-3 py-6 text-center text-muted-foreground"
                                            >
                                                Keine Vorschauzeilen vorhanden.
                                            </td>
                                        </tr>
                                    ) : (
                                        vm.preview.map((row) => (
                                            <tr
                                                key={row.row}
                                                className={cn(
                                                    "border-t",
                                                    errorRows.has(row.row) &&
                                                        "bg-destructive/5",
                                                )}
                                            >
                                                {vm.columns.map((column) => (
                                                    <td
                                                        key={`${row.row}-${column}`}
                                                        className="whitespace-nowrap px-3 py-2"
                                                    >
                                                        {formatPreviewCellValue(
                                                            row,
                                                            column,
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                ) : null}
            </div>

            <div className="border-t px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        disabled={vm.isPreviewLoading || vm.isImporting}
                    >
                        Abbrechen
                    </Button>

                    <LoadingButton
                        loading={vm.isImporting}
                        onClick={handleImport}
                        disabled={!vm.canImport}
                    >
                        Import starten
                    </LoadingButton>
                </div>

                {vm.importError ? (
                    <div className="mt-3 text-sm text-destructive">
                        {vm.importError}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
