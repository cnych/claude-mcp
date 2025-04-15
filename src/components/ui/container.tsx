import * as React from "react"
import { cn } from "@/lib/utils"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 容器的最大宽度，默认使用 max-w-7xl
   */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full" | "prose"
}

/**
 * 容器组件，用于限制内容的最大宽度并提供水平居中
 */
export const Container = React.forwardRef<
  HTMLDivElement,
  ContainerProps
>(({ 
  className, 
  maxWidth = "7xl", 
  children,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto px-4 sm:px-6 lg:px-8",
        maxWidth !== "full" && `max-w-${maxWidth}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

Container.displayName = "Container"