import { TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function RxTextCell(props: { value: string; className?: string }) {
    const { value, className } = props;

    return <TableCell className={cn(className)}>{value}</TableCell>;
}
