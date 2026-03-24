import { useRef } from "react";
import { FileSpreadsheet, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function PharmacyProductsImportUploadCard(props: {
    file: File | null;
    isBusy: boolean;
    onPreviewFile: (file: File) => Promise<void> | void;
    onReset: () => void;
}) {
    const { file, isBusy, onPreviewFile, onReset } = props;
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    return (
        <Card className="rounded-xl p-6">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
                <div className="rounded-full bg-muted p-3">
                    <FileSpreadsheet className="size-6 text-muted-foreground" />
                </div>

                <div className="space-y-1">
                    <div className="font-medium">CSV-Datei auswählen</div>
                    <div className="text-sm text-muted-foreground">
                        Unterstützt wird aktuell eine CSV-Datei im erwarteten
                        Importformat.
                    </div>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,text/csv"
                    className="hidden"
                    onChange={(e) => {
                        const nextFile = e.target.files?.[0];
                        if (!nextFile) return;
                        void onPreviewFile(nextFile);
                    }}
                />

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isBusy}
                    >
                        <Upload className="mr-2 size-4" />
                        Datei auswählen
                    </Button>

                    {file ? (
                        <Button
                            variant="ghost"
                            onClick={onReset}
                            disabled={isBusy}
                        >
                            Zurücksetzen
                        </Button>
                    ) : null}
                </div>

                {file ? (
                    <div className="text-xs text-muted-foreground">
                        {file.name}
                    </div>
                ) : null}
            </div>
        </Card>
    );
}
