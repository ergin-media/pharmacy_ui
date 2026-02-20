import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function RxRowActionsMenu(props: {
    onOpen?: () => void;
    onPdf?: () => void;
    onMore?: () => void;
    onCreateInvoice?: () => void;
    disabled?: boolean;
}) {
    const { onOpen, onPdf, onMore, onCreateInvoice, disabled } = props;

    return (
        <DropdownMenu>
            {/* ✅ Base UI: Trigger über render */}
            <DropdownMenuTrigger
                render={
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={disabled}
                        aria-label="Aktionen"
                    />
                }
            >
                <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>

            {/* ✅ Align/Offsets kommen aus deiner Wrapper-Signatur */}
            <DropdownMenuContent align="end" side="bottom" sideOffset={6}>
                <DropdownMenuItem
                    onClick={() => onOpen?.()}
                    disabled={!onOpen || disabled}
                >
                    Öffnen
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => onPdf?.()}
                    disabled={!onPdf || disabled}
                >
                    PDF
                </DropdownMenuItem>

                {onCreateInvoice ? (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onCreateInvoice?.()} disabled={disabled}>
                            Rechnung erstellen
                        </DropdownMenuItem>
                    </>
                ) : null}

                {onMore ? (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onMore?.()} disabled={disabled}>
                            Mehr…
                        </DropdownMenuItem>
                    </>
                ) : null}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}