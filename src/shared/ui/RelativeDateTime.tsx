import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDateTime } from "@/shared/lib/format/date";
import { formatRelativeDate } from "@/shared/lib/format/date-relative";

export function RelativeDateTime(props: {
    value?: string | null;
    fallback?: string;
    className?: string;
}) {
    const { value, fallback = "—", className = "cursor-default" } = props;

    if (!value) {
        return <span className={className}>{fallback}</span>;
    }

    return (
        <Tooltip>
            <TooltipTrigger>
                <span className={className}>{formatRelativeDate(value)}</span>
            </TooltipTrigger>

            <TooltipContent>{formatDateTime(value)}</TooltipContent>
        </Tooltip>
    );
}
