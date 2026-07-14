import type { InputHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export const Input = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => {
  return <input className={cn('flex h-9 w-full rounded-md border border-transparent bg-transparent px-0 py-1 text-xs text-[#33423c] outline-none placeholder:text-[#a9b1ac] focus-visible:ring-2 focus-visible:ring-[#f26842]/20 disabled:cursor-not-allowed disabled:opacity-50', className)} {...props} />
}
