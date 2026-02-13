import { TableCell, TableRow } from "@/components/ui/table";

export function RxListTableSkeleton(props: { rows?: number }) {
    const rows = props.rows ?? 10;

    return (
        <>
            {Array.from({ length: rows }).map((_, i) => (
                <TableRow key={`sk-${i}`} className="animate-pulse">
                    <TableCell>
                        <div className="h-4 w-45 rounded bg-muted" />
                        <div className="mt-2 h-3 w-35 rounded bg-muted" />
                    </TableCell>

                    <TableCell>
                        <div className="h-4 w-40 rounded bg-muted" />
                        <div className="mt-2 h-3 w-35 rounded bg-muted" />
                    </TableCell>

                    <TableCell>
                        <div className="h-4 w-65 rounded bg-muted" />
                        <div className="mt-2 h-4 w-55 rounded bg-muted" />
                    </TableCell>

                    <TableCell className="text-right">
                        <div className="ml-auto h-4 w-22 rounded bg-muted" />
                        <div className="mt-2 ml-auto h-3 w-28 rounded bg-muted" />
                    </TableCell>

                    <TableCell className="text-right">
                        <div className="ml-auto h-4 w-28 rounded bg-muted" />
                        <div className="mt-2 ml-auto h-3 w-18 rounded bg-muted" />
                    </TableCell>

                    <TableCell>
                        <div className="h-4 w-35 rounded bg-muted" />
                        <div className="mt-2 h-3 w-18 rounded bg-muted" />
                    </TableCell>

                    <TableCell>
                        <div className="h-6 w-22 rounded bg-muted" />
                    </TableCell>

                    <TableCell className="text-right sticky right-0 bg-background">
                        <div className="flex justify-end gap-2">
                            <div className="h-8 w-18 rounded bg-muted" />
                            <div className="h-8 w-14 rounded bg-muted" />
                            <div className="h-8 w-10 rounded bg-muted" />
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </>
    );
}
