import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function ProviderProductsListTableSkeleton(props: { rows: number }) {
    const { rows } = props;

    return (
        <>
            {Array.from({ length: rows }).map((_, i) => (
                <TableRow key={i}>
                    <TableCell className="ps-3">
                        <Skeleton className="h-4 w-64" />
                        <Skeleton className="mt-2 h-3 w-44" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell className="text-right pe-3">
                        <Skeleton className="ml-auto h-8 w-10" />
                    </TableCell>
                </TableRow>
            ))}
        </>
    );
}
