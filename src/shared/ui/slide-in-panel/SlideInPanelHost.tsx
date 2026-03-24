import { cn } from "@/lib/utils";
import { useSlideInPanel, getPanelWidthClass } from "./slideInPanel.store";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

export function SlideInPanelHost() {
    const { panels, closeTop, removeTop } = useSlideInPanel();

    return (
        <>
            {panels.map((p, idx) => {
                const isTop = idx === panels.length - 1;

                return (
                    <Sheet
                        key={p.id}
                        open={p.isOpen}
                        onOpenChange={(open) => {
                            if (!isTop) return;
                            if (!open) closeTop();
                        }}
                    >
                        <SheetContent
                            side="right"
                            className={cn(
                                getPanelWidthClass(
                                    p.variant ?? "md",
                                    p.widthClassName,
                                ),
                            )}
                        >
                            <div
                                className="flex h-full min-h-0 flex-col"
                                onAnimationEnd={() => {
                                    if (!isTop) return;
                                    if (p.isOpen) return;

                                    removeTop();
                                    p.onClosed?.();
                                }}
                            >
                                <SheetHeader>
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <SheetTitle>{p.title}</SheetTitle>

                                            {p.description ? (
                                                <SheetDescription>
                                                    {p.description}
                                                </SheetDescription>
                                            ) : null}
                                        </div>

                                        {p.headerRight ? (
                                            <div className="shrink-0">
                                                {p.headerRight}
                                            </div>
                                        ) : null}
                                    </div>
                                </SheetHeader>

                                <div className="flex-1 overflow-auto px-4 pb-4">
                                    {p.render({ close: closeTop })}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                );
            })}
        </>
    );
}
