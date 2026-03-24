import { AlertCircle } from "lucide-react";

import { Card } from "@/components/ui/card";

import type { PharmacyProductsImportPreviewError } from "../types/pharmacy-products-import.types";
import { formatImportErrorHeadline } from "../lib/pharmacy-products-import.error-formatters";

export function PharmacyProductsImportErrorsCard(props: {
    errors: PharmacyProductsImportPreviewError[];
}) {
    const { errors } = props;

    if (errors.length === 0) return null;

    return (
        <Card className="gap-3 p-4">
            <div className="text-sm font-medium">Fehler in der Datei</div>

            <div className="max-h-56 overflow-auto rounded-lg border">
                <div className="divide-y">
                    {errors.map((error, index) => (
                        <div
                            key={`${error.row}-${error.field ?? "field"}-${index}`}
                            className="flex items-start gap-3 p-3 text-sm"
                        >
                            <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />

                            <div className="space-y-0.5">
                                <div className="font-medium">
                                    {formatImportErrorHeadline(error)}
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
    );
}
