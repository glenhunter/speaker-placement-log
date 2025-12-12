import * as React from "react"
import { cn } from "@/lib/utils"

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
  }

  const variantStyles = {
    default: {
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-primary-foreground)',
    },
    outline: {
      borderColor: 'var(--color-input)',
      backgroundColor: 'var(--color-background)',
    },
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variant === "outline" && "border",
        sizes[size],
        className
      )}
      style={variantStyles[variant]}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
