import type { PatientDto } from "../types/patients.dto";
import type { PatientsSort } from "../types/patients.list.dto";

import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { PatientsListTableSkeleton } from "./PatientsListTableSkeleton";
import { PatientsRowActionsMenu } from "./PatientsRowActionsMenu";
import { patientHasIssues, patientIssuesLabel } from "../lib/patients.issues";
import { formatPersonName } from "@/shared/lib/format/person";
import { formatDate, formatDateTime } from "@/shared/lib/format/date";

export function PatientsListTable(props: {
    items: PatientDto[];
    isLoading?: boolean;
    perPage: number;

    sort: PatientsSort;
    onSortChange: (next: PatientsSort) => void;

    onOpenDetails?: (p: PatientDto) => void;
}) {
    const { items, isLoading, perPage, onOpenDetails } = props;

    return (
        <div className="overflow-x-auto rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="ps-3">Name</TableHead>
                        <TableHead>Kontakt</TableHead>
                        <TableHead className="w-48">Adresse</TableHead>
                        <TableHead className="w-44">Status</TableHead>
                        <TableHead className="w-52">Aktualisiert</TableHead>
                        <TableHead className="w-28 text-right pe-3">
                            Aktionen
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        <PatientsListTableSkeleton rows={perPage} />
                    ) : items.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={6}
                                className="text-muted-foreground"
                            >
                                Keine Patienten gefunden.
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((p) => {
                            const title = formatPersonName(
                                p.first_name,
                                p.last_name,
                            );
                            const hasIssues = patientHasIssues(p);
                            const issuesText = patientIssuesLabel(p.status?.issues);

                            return (
                                <TableRow
                                    key={p.id}
                                    className="hover:bg-muted/50"
                                >
                                    <TableCell className="ps-3">
                                        <div className="font-medium">
                                            {title}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            Geb.: {formatDate(p.birthdate)}{" "}
                                            {p.age != null
                                                ? `(${p.age})`
                                                : ""}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="text-sm mb-1">
                                            {p.contact?.email ?? "—"}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Tel.: {p.contact?.phone ?? "—"}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="text-sm mb-1">
                                            {p.address?.street ?? "—"}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {[p.address?.zip, p.address?.city]
                                                .filter(Boolean)
                                                .join(" ") || "—"}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        {hasIssues ? (
                                            <Badge variant="danger">
                                                {issuesText ?? "Probleme"}
                                            </Badge>
                                        ) : (
                                            <Badge variant="success">
                                                Vollständig
                                            </Badge>
                                        )}
                                    </TableCell>

                                    <TableCell className="whitespace-nowrap text-muted-foreground">
                                        {formatDateTime(p.created_at ?? null)}
                                    </TableCell>

                                    <TableCell className="sticky right-0 text-right pe-3">
                                        <div className="flex justify-end">
                                            <PatientsRowActionsMenu
                                                disabled={isLoading}
                                                onOpenDetails={() =>
                                                    onOpenDetails?.(p)
                                                }
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
