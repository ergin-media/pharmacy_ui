import { cn } from "@/lib/utils";
import * as React from "react";

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
    as?: "h1" | "h2" | "h3" | "h4";
};

export function Heading({ as: Tag = "h1", className, ...props }: HeadingProps) {
    return (
        <Tag
            className={cn(
                {
                    h1: "text-2xl font-semibold tracking-tight",
                    h2: "text-xl font-semibold tracking-tight",
                    h3: "text-lg font-semibold",
                    h4: "text-base font-semibold",
                }[Tag],
                className,
            )}
            {...props}
        />
    );
}
