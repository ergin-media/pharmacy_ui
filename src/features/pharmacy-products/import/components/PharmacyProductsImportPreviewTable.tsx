import { useMemo } from "react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { formatMoney } from "@/shared/lib/format/money";

import type {
    PharmacyProductsImportPreviewError,
    PharmacyProductsImportPreviewRow,
} from "../types/pharmacy-products-import.types";

function formatPreviewCellValue(
    row: PharmacyProductsImportPreviewRow,
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

export function PharmacyProductsImportPreviewTable(props: {
    columns: string[];
    rows: PharmacyProductsImportPreviewRow[];
    errors: PharmacyProductsImportPreviewError[];
    hasPreview: boolean;
}) {
    const { columns, rows, errors, hasPreview } = props;

    const errorRows = useMemo(
        () => new Set(errors.map((error) => error.row)),
        [errors],
    );

    if (!hasPreview || columns.length === 0) return null;

    return (
        <Card className="gap-3 p-4">
            <div className="text-sm font-medium">
                Vorschau der ersten Zeilen
            </div>

            <div className="overflow-auto rounded-lg border">
                <table className="min-w-full text-sm">
                    <thead className="bg-muted/50">
                        <tr>
                            {columns.map((column) => (
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
                        {rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-3 py-6 text-center text-muted-foreground"
                                >
                                    Keine Vorschauzeilen vorhanden.
                                </td>
                            </tr>
                        ) : (
                            rows.map((row) => (
                                <tr
                                    key={row.row}
                                    className={cn(
                                        "border-t",
                                        errorRows.has(row.row) &&
                                            "bg-destructive/5",
                                    )}
                                >
                                    {columns.map((column) => (
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
    );
}
