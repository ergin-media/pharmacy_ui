import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RxManualCreatePreview(props: {
    previewUrl: string | null;
    mimeType: string | null;
}) {
    const { previewUrl, mimeType } = props;

    const isPdf = mimeType === "application/pdf";
    const isImage = mimeType?.startsWith("image/");

    return (
        <Card className="h-full min-h-195 gap-3">
            <CardHeader className="px-0">
                <CardTitle>Vorschau</CardTitle>
            </CardHeader>

            <CardContent className="h-full px-0">
                {!previewUrl ? (
                    <div className="flex h-full min-h-120 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
                        Noch keine Datei hochgeladen.
                    </div>
                ) : isPdf ? (
                    <div className="h-full min-h-120 overflow-hidden rounded-xl border">
                        <iframe
                            title="Rezeptvorschau"
                            src={previewUrl}
                            className="h-full min-h-120 w-full"
                        />
                    </div>
                ) : isImage ? (
                    <div className="overflow-hidden rounded-xl border bg-muted/10">
                        <img
                            src={previewUrl}
                            alt="Rezeptvorschau"
                            className="h-full max-h-[800px] w-full object-contain"
                        />
                    </div>
                ) : (
                    <div className="flex h-full min-h-120 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
                        Für diesen Dateityp ist keine Vorschau verfügbar.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}