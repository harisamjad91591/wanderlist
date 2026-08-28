import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-[15px] font-semibold font-sans cursor-pointer transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // <SearchBar /> submit button
        primary:
          "bg-teal text-white hover:bg-teal-hover px-6 h-[52px] rounded-xl",
        // <CountryCard /> "Add to my list" state
        add: "bg-terracotta text-white hover:bg-terracotta-hover w-full py-[11px] rounded-[11px] text-[14.5px]",
        // <CountryCard /> "Added" state — shown (disabled) right after a
        // successful add, until the amount changes again
        added:
          "bg-white text-muted-4 border-[1.5px] border-card-border w-full py-[11px] rounded-[11px] text-[14.5px] disabled:opacity-100",
        // <CountryCard /> "Remove from list" state
        remove:
          "bg-remove-bg text-muted-3 hover:bg-remove-bg-hover hover:text-remove-text-hover w-full py-[11px] rounded-[11px] text-[14.5px]",
        // "Back to search" link-button on the detail page
        ghost:
          "bg-teal-ghost text-teal hover:bg-teal/10 px-3.5 py-2 rounded-[10px] text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
)

function Button({ className, variant, ...props }) {
  return (
    <button className={cn(buttonVariants({ variant, className }))} {...props} />
  )
}

export { Button, buttonVariants }