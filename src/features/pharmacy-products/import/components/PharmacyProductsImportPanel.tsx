import { useRef } from "react";

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
        // MVP: Import passiert schon beim Upload
        await onImported();
    }

    return (
        <div className="flex h-full min-h-0 flex-col">
            <div className="flex-1 space-y-6 overflow-auto p-4">
                {/* Upload */}
                <div className="rounded-lg border p-6 text-center">
                    <div className="mb-3 text-sm text-muted-foreground">
                        CSV-Datei hochladen
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            vm.actions.upload(file);
                        }}
                    />

                    <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={vm.isUploading}
                    >
                        Datei auswählen
                    </Button>

                    {vm.file ? (
                        <div className="mt-3 text-xs text-muted-foreground">
                            {vm.file.name}
                        </div>
                    ) : null}
                </div>

                {/* Preview */}
                {vm.preview.length > 0 && (
                    <div className="space-y-2">
                        <div className="text-sm font-medium">
                            Vorschau (erste Einträge)
                        </div>

                        <div className="overflow-auto rounded-md border">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr>
                                        {Object.keys(vm.preview[0]).map((k) => (
                                            <th
                                                key={k}
                                                className="px-3 py-2 text-left"
                                            >
                                                {k}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {vm.preview.slice(0, 10).map((row, i) => (
                                        <tr key={i} className="border-t">
                                            {Object.values(row).map(
                                                (v, j) => (
                                                    <td
                                                        key={j}
                                                        className="px-3 py-2"
                                                    >
                                                        {String(v)}
                                                    </td>
                                                ),
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="border-t px-4 py-3">
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onCancel}>
                        Abbrechen
                    </Button>

                    <LoadingButton
                        loading={vm.isUploading}
                        onClick={handleImport}
                        disabled={!vm.file}
                    >
                        Import abschließen
                    </LoadingButton>
                </div>
            </div>
        </div>
    );
}