import { TableCell, TableRow } from "@/components/ui/table";

export function PharmacyProductsListTableSkeleton(props: { rows: number }) {
    const { rows } = props;

    return (
        <>
            {Array.from({ length: rows }).map((_, i) => (
                <TableRow key={i}>
                    <TableCell className="ps-3">
                        <div className="h-4 w-72 animate-pulse rounded bg-muted" />
                        <div className="mt-2 h-3 w-40 animate-pulse rounded bg-muted" />
                    </TableCell>
                    <TableCell>
                        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                    </TableCell>
                    <TableCell>
                        <div className="h-5 w-18 animate-pulse rounded bg-muted" />
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="ml-auto h-4 w-20 animate-pulse rounded bg-muted" />
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="ml-auto h-4 w-20 animate-pulse rounded bg-muted" />
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                        <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                    </TableCell>
                    <TableCell className="sticky right-0 text-right pe-3">
                        <div className="ml-auto h-8 w-10 animate-pulse rounded bg-muted" />
                    </TableCell>
                </TableRow>
            ))}
        </>
    );
}
