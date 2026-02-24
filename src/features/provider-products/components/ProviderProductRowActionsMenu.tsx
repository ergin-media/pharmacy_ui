import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Link2, Unlink } from "lucide-react";

export function ProviderProductRowActionsMenu(props: {
    disabled?: boolean;
    isMapped: boolean;
    onManageMapping: () => void;
    onRemoveMapping: () => void;
}) {
    const { disabled, isMapped, onManageMapping, onRemoveMapping } = props;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        disabled={disabled}
                    />
                }
            >
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Aktionen</span>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={6} className="w-56">
                <DropdownMenuItem onClick={onManageMapping}>
                    <Link2 className="size-4" />
                    Mapping verwalten
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    variant="destructive"
                    disabled={!isMapped}
                    onClick={onRemoveMapping}
                >
                    <Unlink className="size-4" />
                    Zuordnung entfernen
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
