import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#547792] focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-[#547792] text-white hover:bg-[#213448] dark:bg-[#94B4C1] dark:text-[#213448] dark:hover:bg-[#EAE0CF]",
                secondary:
                    "border-transparent bg-[#EAE0CF] text-[#213448] hover:bg-[#94B4C1]/30 dark:bg-[#213448] dark:text-[#94B4C1] dark:hover:bg-[#547792]/30",
                destructive:
                    "border-transparent bg-red-500 text-white hover:bg-red-600",
                outline: "text-[#213448] border-[#94B4C1] dark:text-[#EAE0CF] dark:border-[#547792]",
                gradient:
                    "border-transparent bg-gradient-to-r from-[#547792]/20 to-[#94B4C1]/20 text-[#547792] dark:from-[#547792]/30 dark:to-[#94B4C1]/30 dark:text-[#94B4C1]",
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
