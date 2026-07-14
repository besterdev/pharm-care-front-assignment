import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva('inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f26842]/40 disabled:pointer-events-none disabled:opacity-50', {
  variants: {
    variant: {
      default: 'bg-[#f26842] text-white hover:bg-[#dc5937]',
      outline: 'border border-[#d7ddd7] bg-transparent text-[#55645d] hover:bg-white hover:border-[#a6b5ab]',
      ghost: 'text-[#718079] hover:bg-[#eef1ed] hover:text-[#3f5149]',
    },
    size: { default: 'h-9 px-3', sm: 'h-8 px-2.5 text-[10px]', icon: 'h-8 w-8' },
  },
  defaultVariants: { variant: 'default', size: 'default' },
})

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  return <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
})

Button.displayName = 'Button'
