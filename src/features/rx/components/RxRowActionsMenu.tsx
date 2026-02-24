import {
    MoreHorizontal,
    ExternalLink,
    FileText,
    Receipt,
} from "lucide-react";

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

            <DropdownMenuContent align="end" side="bottom" sideOffset={6}>
                <DropdownMenuItem
                    onClick={() => onOpen?.()}
                    disabled={!onOpen || disabled}
                >
                    <ExternalLink className="size-4" />
                    Öffnen
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => onPdf?.()}
                    disabled={!onPdf || disabled}
                >
                    <FileText className="size-4" />
                    PDF
                </DropdownMenuItem>

                {onCreateInvoice ? (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => onCreateInvoice?.()}
                            disabled={disabled}
                        >
                            <Receipt className="size-4" />
                            Rechnung erstellen
                        </DropdownMenuItem>
                    </>
                ) : null}

                {onMore ? (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => onMore?.()}
                            disabled={disabled}
                        >
                            <MoreHorizontal className="size-4" />
                            Mehr…
                        </DropdownMenuItem>
                    </>
                ) : null}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}