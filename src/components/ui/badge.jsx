import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center font-mono font-bold rounded-full",
  {
    variants: {
      variant: {
        // small pill used next to "My List" nav link, and the currency pill
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

function Badge({ className, variant, size, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant, size, className }))} {...props} />
  )
}

export { Badge, badgeVariants }
