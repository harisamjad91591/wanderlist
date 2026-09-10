import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center font-mono font-bold rounded-full",
  {
    variants: {
      variant: {
        teal: "text-teal bg-teal-soft",
      },
      size: {
        sm: "text-xs px-2 py-0.5",
        md: "text-[13px] px-3 py-1",
      },
    },
    defaultVariants: {
      variant: "teal",
      size: "sm",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size, className }))} {...props} />
  )
}

export { Badge, badgeVariants }