import * as React from 'react'
import { Popover as PopoverPrimitive } from 'radix-ui'
import { cn } from '@/lib/utils'

const Popover = (props: React.ComponentProps<typeof PopoverPrimitive.Root>) => {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

const PopoverTrigger = (props: React.ComponentProps<typeof PopoverPrimitive.Trigger>) => {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

const PopoverContent = ({ className, align = 'center', sideOffset = 4, ...props }: React.ComponentProps<typeof PopoverPrimitive.Content>) => {
  return <PopoverPrimitive.Portal><PopoverPrimitive.Content data-slot="popover-content" align={align} sideOffset={sideOffset} className={cn('z-50 flex w-72 flex-col gap-2.5 rounded-xl border border-[#e1e5f4] bg-white p-2.5 text-sm text-[#4b536f] shadow-[0_16px_34px_rgba(82,98,171,.16)] outline-none data-[state=open]:animate-[fade-in_.15s_ease-out]', className)} {...props} /></PopoverPrimitive.Portal>
}

const PopoverAnchor = (props: React.ComponentProps<typeof PopoverPrimitive.Anchor>) => {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger }
