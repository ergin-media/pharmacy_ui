import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ExternalLink } from "lucide-react";

export function PatientsRowActionsMenu(props: {
    disabled?: boolean;
    onOpenDetails?: () => void;
}) {
    const { disabled, onOpenDetails } = props;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        disabled={disabled}
                        className="h-8 w-8"
                    />
                }
            >
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Aktionen</span>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onSelect={() => onOpenDetails?.()}>
                    <ExternalLink className="size-4" />
                    <span>Details öffnen</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
