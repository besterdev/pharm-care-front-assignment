import * as React from 'react'
import { DayPicker } from 'react-day-picker'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const Calendar = ({ className, classNames, showOutsideDays = true, ...props }: React.ComponentProps<typeof DayPicker>) => {
  return <DayPicker
    showOutsideDays={showOutsideDays}
    className={cn('p-1', className)}
    classNames={{
      months: 'flex flex-col', month: 'space-y-3', month_caption: 'relative flex h-8 items-center justify-center', caption_label: 'text-[12px] font-semibold text-[#4b536f]', nav: 'absolute inset-x-0 top-0 flex items-center justify-between', button_previous: 'grid size-7 place-items-center rounded-md text-[#6679ce] transition hover:bg-[#eef1ff]', button_next: 'grid size-7 place-items-center rounded-md text-[#6679ce] transition hover:bg-[#eef1ff]', month_grid: 'w-full border-collapse', weekdays: 'flex', weekday: 'w-9 text-center text-[9px] font-medium text-[#9aa1b8]', week: 'mt-1 flex w-full', day: 'size-9 p-0 text-center text-[11px]', day_button: 'grid size-9 place-items-center rounded-md transition hover:bg-[#eef1ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5871d8]/40 aria-selected:bg-[#5871d8] aria-selected:text-white', selected: 'bg-[#5871d8] text-white', range_start: 'rounded-l-md bg-[#5871d8] text-white', range_end: 'rounded-r-md bg-[#5871d8] text-white', range_middle: 'rounded-none bg-[#e8edff] text-[#4b536f]', today: 'font-bold text-[#4e6bd6]', outside: 'text-[#c1c7d8] opacity-60', disabled: 'text-[#c1c7d8] opacity-40', hidden: 'invisible', ...classNames,
    }}
    components={{ Chevron: ({ orientation }) => orientation === 'left' ? <ChevronLeft size={15} /> : <ChevronRight size={15} /> }}
    {...props}
  />
}

export { Calendar }
