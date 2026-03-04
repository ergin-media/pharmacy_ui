import { cn } from "@/lib/utils";

export function TypographyH1({
    className,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h1
            className={cn(
                "scroll-m-20 text-xl font-semibold tracking-tight",
                className,
            )}
            {...props}
        />
    );
}

export function TypographyH2({
    className,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h2
            className={cn(
                "scroll-m-20 text-lg font-semibold tracking-tight",
                className,
            )}
            {...props}
        />
    );
}

export function TypographyP({
    className,
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
    return <p className={className} {...props} />;
}
