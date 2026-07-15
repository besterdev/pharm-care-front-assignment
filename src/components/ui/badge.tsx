import type { HTMLAttributes } from 'react'
import { cn } from "@/shared/utils/cn"

export const Badge = ({ className, ...props }: HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn('inline-flex items-center rounded-md border border-transparent px-2 py-0.5 text-[10px] font-medium transition-colors', className)} {...props} />
}
