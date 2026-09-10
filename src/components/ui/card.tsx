import { cn } from "@/lib/utils"

// This is the standard shadcn Card — a plain box made of small pieces
// you stack together: Card > CardHeader (title + description) >
// CardContent (the main stuff) > CardFooter (buttons, usually).
// You don't have to use every piece every time.

function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "bg-white border border-card-border rounded-[18px] shadow-[0_4px_20px_rgba(20,45,55,0.05)]",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }) {
  return <div className={cn("p-[18px] pb-0", className)} {...props} />
}

function CardTitle({ className, ...props }) {
  return (
    <div
      className={cn(
        "font-display font-semibold text-[19px] tracking-[-0.01em]",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }) {
  return (
    <div className={cn("font-mono text-xs text-muted-2 mt-0.5", className)} {...props} />
  )
}

function CardContent({ className, ...props }) {
  return <div className={cn("p-[18px]", className)} {...props} />
}

function CardFooter({ className, ...props }) {
  return <div className={cn("p-[18px] pt-0", className)} {...props} />
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
