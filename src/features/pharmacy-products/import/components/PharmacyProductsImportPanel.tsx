import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";

import { usePharmacyProductsImport } from "../hooks/usePharmacyProductsImport";
import { PharmacyProductsImportUploadCard } from "./PharmacyProductsImportUploadCard";
import { PharmacyProductsImportHeaderIssues } from "./PharmacyProductsImportHeaderIssues";
import { PharmacyProductsImportSummaryCards } from "./PharmacyProductsImportSummaryCards";
import { PharmacyProductsImportErrorsCard } from "./PharmacyProductsImportErrorsCard";
import { PharmacyProductsImportPreviewTable } from "./PharmacyProductsImportPreviewTable";

export function PharmacyProductsImportPanel(props: {
    onCancel: () => void;
    onImported: () => Promise<void> | void;
}) {
    const { onCancel, onImported } = props;
    const vm = usePharmacyProductsImport();

    async function handleImport() {
        const result = await vm.actions.import();
        if (!result) return;

        await onImported();
    }

    return (
        <div className="flex h-full min-h-0 flex-col">
            <div className="flex flex-1 flex-col gap-3 overflow-auto">
                <PharmacyProductsImportUploadCard
                    file={vm.file}
                    isBusy={vm.isPreviewLoading || vm.isImporting}
                    onPreviewFile={vm.actions.preview}
                    onReset={vm.actions.reset}
                />

                <PharmacyProductsImportHeaderIssues
                    previewError={vm.previewError}
                    missingColumns={vm.missingColumns}
                    foundColumns={vm.foundColumns}
                    unknownColumns={vm.unknownColumns}
                    allowedColumns={vm.allowedColumns}
                />

                <PharmacyProductsImportSummaryCards summary={vm.summary} />

                {vm.summary && vm.summary.invalid_rows > 0 ? (
                    <div className="text-sm text-muted-foreground">
                        Zeilen mit Fehlern werden nicht importiert.
                    </div>
                ) : null}

                <PharmacyProductsImportErrorsCard errors={vm.errors} />

                <PharmacyProductsImportPreviewTable
                    columns={vm.columns}
                    rows={vm.preview}
                    errors={vm.errors}
                    hasPreview={vm.hasPreview}
                />
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
