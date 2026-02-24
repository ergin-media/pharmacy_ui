import { cva, type VariantProps } from "class-variance-authority";

export const badgeVariants = cva(
    "inline-flex items-center justify-center rounded-full border border-transparent px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
                secondary:
                    "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
                destructive:
                    "bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
                outline:
                    "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
                ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
                link: "text-primary underline-offset-4 [a&]:hover:underline",

                success:
                    "bg-emerald-100 text-emerald-800 border-emerald-200 " +
                    "dark:bg-emerald-500/15 dark:text-emerald-200 dark:border-emerald-500/30 " +
                    "[a&]:hover:bg-emerald-100/80 dark:[a&]:hover:bg-emerald-500/20",

                info:
                    "bg-sky-100 text-sky-800 border-sky-200 " +
                    "dark:bg-sky-500/15 dark:text-sky-200 dark:border-sky-500/30 " +
                    "[a&]:hover:bg-sky-100/80 dark:[a&]:hover:bg-sky-500/20",

                warning:
                    "bg-amber-100 text-amber-900 border-amber-200 " +
                    "dark:bg-amber-500/15 dark:text-amber-200 dark:border-amber-500/30 " +
                    "[a&]:hover:bg-amber-100/80 dark:[a&]:hover:bg-amber-500/20",

                danger:
                    "bg-red-100 text-red-800 border-red-200 " +
                    "dark:bg-red-500/15 dark:text-red-200 dark:border-red-500/30 " +
                    "[a&]:hover:bg-red-100/80 dark:[a&]:hover:bg-red-500/20",

                neutral:
                    "bg-muted text-muted-foreground border-border " +
                    "dark:bg-muted/40 dark:text-muted-foreground dark:border-border/60 " +
                    "[a&]:hover:bg-muted/80 dark:[a&]:hover:bg-muted/50",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];
