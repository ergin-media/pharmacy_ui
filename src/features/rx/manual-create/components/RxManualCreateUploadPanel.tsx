import { useRef } from "react";
import { FileUp, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RxManualCreateUploadPanel(props: {
    file: File | null;
    onFileSelect: (file: File | null) => void;
}) {
    const { file, onFileSelect } = props;
    const inputRef = useRef<HTMLInputElement | null>(null);

    return (
        <Card className="gap-3">
            <CardHeader className="px-0">
                <CardTitle>Rezeptdatei</CardTitle>
            </CardHeader>

            <CardContent className="grid gap-4 px-0">
                <input
                    ref={inputRef}
                    type="file"
                    accept="application/pdf,image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                        const nextFile = e.target.files?.[0] ?? null;
                        onFileSelect(nextFile);
                    }}
                />

                <div className="flex flex-wrap gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => inputRef.current?.click()}
                    >
                        <FileUp className="mr-2 size-4" />
                        {file ? "Datei ersetzen" : "Datei hochladen"}
                    </Button>

                    {file ? (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onFileSelect(null)}
                        >
                            <Trash2 className="mr-2 size-4" />
                            Datei entfernen
                        </Button>
                    ) : null}
                </div>

                <div className="text-xs text-muted-foreground">
                    Unterstützte Formate: PDF, PNG, JPG, WEBP
                </div>

                {file ? (
                    <div className="rounded-lg border bg-muted/20 px-3 py-2 text-sm">
                        {file.name}
                    </div>
                ) : null}
            </CardContent>
        </Card>
    );
}