"use client"

import * as React from "react"
import { Dialog as SheetPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

const Sheet = ({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) => {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

const SheetTrigger = ({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) => {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

const SheetClose = ({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) => {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

const SheetPortal = ({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) => {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

const SheetOverlay = ({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) => {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-[#1725215c] backdrop-blur-[1px] data-[state=open]:animate-[fade-in_.2s_ease-out] data-[state=closed]:animate-[fade-out_.15s_ease-in]",
        className
      )}
      {...props}
    />
  )
}

const SheetContent = ({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
}) => {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex h-full w-3/4 flex-col gap-4 bg-popover text-sm text-popover-foreground shadow-[-16px_0_44px_rgba(23,37,33,.17)] data-[state=open]:animate-[sheet-in-right_.22s_ease-out] data-[state=closed]:animate-[sheet-out-right_.16s_ease-in] sm:max-w-sm",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close data-slot="sheet-close" asChild>
            <Button
              variant="ghost"
              className="absolute top-3 right-3"
              size="icon"
            >
              <XIcon
              />
              <span className="sr-only">Close</span>
            </Button>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

const SheetHeader = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-0.5 p-4", className)}
      {...props}
    />
  )
}

const SheetFooter = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

const SheetTitle = ({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) => {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        "text-base font-medium text-foreground",
        className
      )}
      {...props}
    />
  )
}

const SheetDescription = ({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) => {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
