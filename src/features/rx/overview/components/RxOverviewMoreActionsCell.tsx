import { TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExternalLink, MoreHorizontal, Trash2 } from "lucide-react";

import type { RxListItemDto } from "../../types/rx.dto";

export function RxOverviewMoreActionsCell(props: {
    rx: RxListItemDto;
    disabled?: boolean;
    onOpen?: (rx: RxListItemDto) => void;
    onDelete?: (rx: RxListItemDto) => void;
}) {
    const { rx, disabled, onOpen, onDelete } = props;

    return (
        <TableCell className="text-right pe-3">
            <div className="flex justify-end">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={disabled}
                            aria-label="Aktionen"
                        >
                            <MoreHorizontal className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" side="bottom" sideOffset={6}>
                        <DropdownMenuItem
                            onClick={() => onOpen?.(rx)}
                            disabled={!onOpen || disabled}
                        >
                            <ExternalLink className="size-4" />
                            Rezept öffnen
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => onDelete?.(rx)}
                            disabled={!onDelete || disabled}
                            className="text-destructive focus:text-destructive"
                        >
                            <Trash2 className="size-4" />
                            Löschen
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </TableCell>
    );
}