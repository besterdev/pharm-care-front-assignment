import { lazy, Suspense } from "react"
import { CalendarDays, Search, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { DateRangeFilter, StatusFilter } from "@/types/task"
import type { DateRange } from "react-day-picker"

const Calendar = lazy(() =>
  import("@/components/ui/calendar").then((module) => ({
    default: module.Calendar,
  })),
)
type Props = {
  query: string
  service: string
  status: StatusFilter
  dateRange: DateRangeFilter
  fromDate: string
  toDate: string
  onQueryChange: (value: string) => void
  onServiceChange: (value: string) => void
  onStatusChange: (value: StatusFilter) => void
  onDateRangeChange: (value: DateRangeFilter) => void
  onFromDateChange: (value: string) => void
  onToDateChange: (value: string) => void
  onReset: () => void
}
const filters: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
]
export const TaskFilters = ({
  query,
  service,
  status,
  dateRange,
  fromDate,
  toDate,
  onQueryChange,
  onServiceChange,
  onStatusChange,
  onDateRangeChange,
  onFromDateChange,
  onToDateChange,
  onReset,
}: Props) => {
  const hasFilters =
    query || service !== "all" || status !== "all" || dateRange !== "all"
  const selectedRange: DateRange | undefined = fromDate
    ? { from: parseDate(fromDate), to: toDate ? parseDate(toDate) : undefined }
    : undefined

  const handleDateSelect = (range: DateRange | undefined) => {
    onFromDateChange(range?.from ? toDateValue(range.from) : "")
    onToDateChange(range?.to ? toDateValue(range.to) : "")
  }

  const handleDateRangeChange = (value: DateRangeFilter) => {
    onDateRangeChange(value)
  }
  return (
    <div className="mb-5 flex flex-wrap items-start gap-2 rounded-xl bg-white p-2 shadow-[0_6px_14px_rgba(82,98,171,.06)] max-sm:gap-1.5">
      <label className="flex h-[38px] w-[290px] max-w-full items-center gap-2 rounded-lg border border-[#e7e9f5] bg-[#fafbff] px-3 text-[#839188] transition-colors focus-within:border-[#6679ce] focus-within:ring-2 focus-within:ring-[#6679ce]/15 max-[620px]:w-full">
        <Search size={17} />
        <span className="sr-only">Search consultations</span>
        <Input
          className="h-full rounded-none border-0 focus-visible:ring-0"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search customer name"
        />
      </label>
      <div className="flex h-[38px] items-center gap-2 rounded-lg border border-[#e7e9f5] bg-[#fafbff] pl-3 text-[#839188] max-[620px]:flex-1">
        <SlidersHorizontal size={15} />
        <Select value={service} onValueChange={onServiceChange}>
          <SelectTrigger className="h-[36px] min-w-[132px] border-0 bg-transparent text-[11px] text-[#65746c] shadow-none">
            <SelectValue placeholder="All services" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All services</SelectItem>
            <SelectItem value="video_call">Video call</SelectItem>
            <SelectItem value="voice_call">Voice / phone</SelectItem>
            <SelectItem value="chat">Chat</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex h-[38px] items-center gap-2 max-[620px]:h-auto max-[620px]:w-full max-[620px]:flex-wrap">
        <div className="flex h-[38px] items-center gap-2 rounded-lg border border-[#e7e9f5] bg-[#fafbff] pl-3 text-[#839188] max-[620px]:w-full">
          <CalendarDays size={15} />
          <Select
            value={dateRange}
            onValueChange={(value) =>
              handleDateRangeChange(value as DateRangeFilter)
            }
          >
            <SelectTrigger className="h-[36px] min-w-[126px] border-0 bg-transparent text-[11px] text-[#65746c] shadow-none">
              <SelectValue placeholder="Any date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any date</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this_week">This week</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {dateRange === "custom" && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-[38px] min-w-[184px] justify-start border-[#e7e9f5] bg-[#fafbff] px-3 text-[11px] font-normal text-[#65746c] hover:bg-[#f4f6ff] max-[620px]:w-full"
              >
                <CalendarDays size={15} className="text-[#6679ce]" />
                {fromDate
                  ? `${formatDate(fromDate)}${toDate ? ` – ${formatDate(toDate)}` : ""}`
                  : "Select dates"}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-auto max-[420px]:max-w-[calc(100vw-72px)] max-[420px]:overflow-x-auto p-2"
            >
              <Suspense
                fallback={
                  <div
                    className="h-[298px] w-[280px] animate-pulse rounded-lg bg-[#f2f4fc]"
                    aria-label="Loading calendar"
                  />
                }
              >
                <Calendar
                  mode="range"
                  selected={selectedRange}
                  onSelect={handleDateSelect}
                  numberOfMonths={1}
                />
              </Suspense>
            </PopoverContent>
          </Popover>
        )}
      </div>
      <Tabs
        value={status}
        onValueChange={(value) => onStatusChange(value as StatusFilter)}
        className="ml-auto max-[1180px]:order-4 max-[1180px]:w-full max-[620px]:order-5"
      >
        <TabsList className="w-full gap-0.5 overflow-x-auto bg-transparent p-0">
          {filters.map((filter) => (
            <TabsTrigger
              key={filter.value}
              value={filter.value}
              className="h-8 min-w-fit px-2.5 text-[11px] data-[state=active]:bg-[#5871d8] data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              {filter.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {hasFilters && (
        <Button
          variant="ghost"
          size="icon"
          className="text-[#c26950]"
          onClick={onReset}
          aria-label="Clear filters"
        >
          <X size={16} />
        </Button>
      )}
    </div>
  )
}

const parseDate = (value: string): Date => {
  return new Date(`${value}T00:00:00`)
}

const toDateValue = (value: Date): string => {
  const offset = value.getTimezoneOffset() * 60_000
  return new Date(value.getTime() - offset).toISOString().slice(0, 10)
}

const formatDate = (value: string): string => {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(parseDate(value))
}
