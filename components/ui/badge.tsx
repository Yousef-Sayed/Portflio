import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background hover:shadow-sm",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md shadow-sm",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-md shadow-sm",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 hover:shadow-md shadow-sm",
                outline: "text-foreground border-primary/60 hover:bg-primary/15 hover:border-primary hover:shadow-md dark:hover:bg-primary/25",
                gradient:
                    "border-transparent bg-gradient-to-r from-primary/20 to-accent/20 text-primary dark:from-primary/30 dark:to-accent/30 dark:text-primary border-primary/10 hover:shadow-md",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
