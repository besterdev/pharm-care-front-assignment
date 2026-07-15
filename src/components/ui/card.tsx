import type { HTMLAttributes } from 'react'
import { cn } from "@/shared/utils/cn"

export const Card = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  return <article className={cn('rounded-lg border border-[#e4e8e2] bg-white text-[#1d2826]', className)} {...props} />
}
