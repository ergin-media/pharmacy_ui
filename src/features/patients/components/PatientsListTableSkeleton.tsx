import { TableRow, TableCell } from "@/components/ui/table";

export function PatientsListTableSkeleton(props: { rows: number }) {
    const { rows } = props;

    return (
        <>
            {Array.from({ length: rows }).map((_, idx) => (
                <TableRow key={idx}>
                    <TableCell className="ps-3">
                        <div className="h-4 w-40 rounded bg-muted" />
                        <div className="mt-2 h-3 w-28 rounded bg-muted" />
                    </TableCell>
                    <TableCell>
                        <div className="h-4 w-48 rounded bg-muted" />
                    </TableCell>
                    <TableCell>
                        <div className="h-4 w-32 rounded bg-muted" />
                    </TableCell>
                    <TableCell>
                        <div className="h-4 w-28 rounded bg-muted" />
                    </TableCell>
                    <TableCell className="text-right pe-3">
                        <div className="ml-auto h-8 w-8 rounded bg-muted" />
                    </TableCell>
                </TableRow>
            ))}
        </>
    );
}
