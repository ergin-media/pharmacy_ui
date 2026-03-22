import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal, Pencil } from "lucide-react";

export function PharmacyProductRowActionsMenu(props: {
    disabled?: boolean;
    onEdit?: () => void;
}) {
    const { disabled, onEdit } = props;

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
                <DropdownMenuItem onClick={() => onEdit?.()}>
                    <Pencil className="size-4" />
                    <span>Bearbeiten</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}