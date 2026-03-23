import { useRef } from "react";
import { AlertCircle, FileSpreadsheet, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";

import { usePharmacyProductsImport } from "../hooks/usePharmacyProductsImport";

export function PharmacyProductsImportPanel(props: {
    onCancel: () => void;
    onImported: () => Promise<void> | void;
}) {
    const { onCancel, onImported } = props;

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const vm = usePharmacyProductsImport();

    async function handleImport() {
        const result = await vm.actions.import();
        if (!result) return;

        await onImported();
    }

    return (
        <div className="flex h-full min-h-0 flex-col">
            <div className="flex-1 space-y-6 overflow-auto p-4">
                <div className="space-y-2">
                    <div className="text-base font-medium">CSV-Import</div>
                    <div className="text-sm text-muted-foreground">
                        Lade eine CSV-Datei hoch, prüfe die Vorschau und starte
                        anschließend den Import.
                    </div>
                </div>

                <div className="rounded-xl border border-dashed p-6">
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
                                disabled={
                                    vm.isPreviewLoading || vm.isImporting
                                }
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
                </div>

                {vm.previewError ? (
                    <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                        <AlertCircle className="mt-0.5 size-4 shrink-0" />
                        <div>{vm.previewError}</div>
                    </div>
                ) : null}

                {vm.summary ? (
                    <div className="grid gap-3 md:grid-cols-3">
                        <div className="rounded-lg border p-4">
                            <div className="text-xs text-muted-foreground">
                                Gesamtzeilen
                            </div>
                            <div className="mt-1 text-2xl font-semibold">
                                {vm.summary.total_rows}
                            </div>
                        </div>

                        <div className="rounded-lg border p-4">
                            <div className="text-xs text-muted-foreground">
                                Gültig
                            </div>
                            <div className="mt-1 text-2xl font-semibold text-green-600">
                                {vm.summary.valid_rows}
                            </div>
                        </div>

                        <div className="rounded-lg border p-4">
                            <div className="text-xs text-muted-foreground">
                                Fehlerhaft
                            </div>
                            <div className="mt-1 text-2xl font-semibold text-destructive">
                                {vm.summary.invalid_rows}
                            </div>
                        </div>
                    </div>
                ) : null}

                {vm.errors.length > 0 ? (
                    <div className="space-y-2">
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
                                                Zeile {error.row}
                                                {error.field
                                                    ? ` · ${error.field}`
                                                    : ""}
                                            </div>
                                            <div className="text-muted-foreground">
                                                {error.message}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : null}

                {vm.hasPreview && vm.columns.length > 0 ? (
                    <div className="space-y-2">
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
                                                className="border-t"
                                            >
                                                {vm.columns.map((column) => (
                                                    <td
                                                        key={`${row.row}-${column}`}
                                                        className="whitespace-nowrap px-3 py-2"
                                                    >
                                                        {row.values[column] ==
                                                            null
                                                            ? "—"
                                                            : String(
                                                                row.values[
                                                                column
                                                                ],
                                                            )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
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