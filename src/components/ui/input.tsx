import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "font-sans text-[16px] text-ink bg-white border-[1.5px] border-input-border rounded-xl px-[18px] py-[14px] transition-[border-color,box-shadow] duration-150 w-full",
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }