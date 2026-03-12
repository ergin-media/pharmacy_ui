import * as React from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LoadingButtonProps = React.ComponentProps<typeof Button> & {
    loading?: boolean;
    loadingText?: React.ReactNode;
};

export function LoadingButton(props: LoadingButtonProps) {
    const {
        loading = false,
        loadingText,
        disabled,
        children,
        className,
        ...rest
    } = props;

    return (
        <Button
            className={cn("relative", className)}
            disabled={disabled || loading}
            {...rest}
        >
            {loading ? (
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <Loader2 className="size-4 animate-spin" />
                </span>
            ) : null}

            <span
                className={cn(
                    "inline-flex items-center justify-center",
                    loading && "invisible",
                )}
            >
                {loading && loadingText ? loadingText : children}
            </span>
        </Button>
    );
}
