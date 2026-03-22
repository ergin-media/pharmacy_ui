import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    MoreHorizontal,
    Copy,
    ExternalLink,
    Pencil,
    Power,
} from "lucide-react";

export function PharmacyProductRowActionsMenu(props: {
    disabled?: boolean;
    onCopyPzn?: () => void;
    onOpenDetails?: () => void;
    onEdit?: () => void;
    onToggleActive?: () => void;
    toggleLabel?: string;
}) {
    const {
        disabled,
        onCopyPzn,
        onOpenDetails,
        onEdit,
        onToggleActive,
        toggleLabel = "Status ändern",
    } = props;

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
                <DropdownMenuItem onClick={() => onOpenDetails?.()}>
                    <ExternalLink className="size-4" />
                    <span>Details öffnen</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => onCopyPzn?.()}>
                    <Copy className="size-4" />
                    <span>PZN kopieren</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => onEdit?.()}>
                    <Pencil className="size-4" />
                    <span>Bearbeiten</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onToggleActive?.()}
                >
                    <Power className="size-4" />
                    <span>{toggleLabel}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}