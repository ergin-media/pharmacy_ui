import { TableCell } from "@/components/ui/table";
import type { RxTableRowVm } from "../lib/rx.table-row.vm";

export function RxPatientCell({ row }: { row: RxTableRowVm }) {
    return (
        <TableCell>
            <div className="flex flex-col gap-1">
                <div className="font-medium">{row.patientTitle}</div>

                {row.patientStreet && (
                    <div className="text-xs text-muted-foreground">
                        {row.patientStreet}
                    </div>
                )}

                {row.patientCityLine && (
                    <div className="text-xs text-muted-foreground">
                        {row.patientCityLine}
                    </div>
                )}

                {row.patientEmail && (
                    <div className="text-xs text-muted-foreground">
                        {row.patientEmail}
                    </div>
                )}

                {row.patientMetaItems.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                        {row.patientMetaItems.join(" | ")}
                    </div>
                )}
            </div>
        </TableCell>
    );
}
