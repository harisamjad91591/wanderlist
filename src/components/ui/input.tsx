import { cn } from "@/lib/utils"

function Input({ className, type = "text", ...props }) {
  return (
    <input
      type={type}
      className={cn(
        "font-sans text-[16px] text-ink bg-white border-[1.5px] border-input-border rounded-xl px-[18px] py-[14px] transition-[border-color,box-shadow] duration-150 w-full",
        className
      )}
      {...props}
    />
  )
}

export { Input }
