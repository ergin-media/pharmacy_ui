import type * as React from "react";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function SideSheet(props: {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    title?: string;
    description?: string;

    side?: "right" | "left" | "top" | "bottom";
    children: React.ReactNode;

    footer?: React.ReactNode;
}) {
    const {
        open,
        onOpenChange,
        title,
        description,
        side = "right",
        children,
        footer,
    } = props;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side={side} className="flex flex-col">
                {(title || description) && (
                    <SheetHeader>
                        {title ? <SheetTitle>{title}</SheetTitle> : null}
                        {description ? (
                            <SheetDescription>{description}</SheetDescription>
                        ) : null}
                    </SheetHeader>
                )}

                <div className="flex-1 overflow-auto px-4 py-2">
                    {children}
                </div>

                <SheetFooter>
                    {footer ?? (
                        <SheetClose
                            render={
                                <Button variant="outline">Schließen</Button>
                            }
                        />
                    )}
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
