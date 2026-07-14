import { ClipboardList, RefreshCw, SearchX, TriangleAlert } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import type { ConsultationTask, ViewMode } from "@/types/task"
import { TaskCard } from "./task-card"

type Props = {
  tasks: ConsultationTask[]
  view: ViewMode
  isLoading: boolean
  isError: boolean
  errorMessage: string
  hasActiveFilters: boolean
  updatingKeys: ReadonlySet<string>
  onOpen: (task: ConsultationTask) => void
  onAdvance: (task: ConsultationTask) => void
  onRetry: () => void
  onClearFilters: () => void
}

export const TaskList = ({
  tasks,
  view,
  isLoading,
  isError,
  errorMessage,
  hasActiveFilters,
  updatingKeys,
  onOpen,
  onAdvance,
  onRetry,
  onClearFilters,
}: Props) => {
  if (isLoading) return <LoadingState />

  if (isError) return <ErrorState message={errorMessage} onRetry={onRetry} />

  if (!tasks.length)
    return (
      <EmptyState filtered={hasActiveFilters} onClearFilters={onClearFilters} />
    )

  return (
    <motion.div
      layout
      className={cn(
        "grid grid-cols-3 gap-3 max-[1050px]:grid-cols-2 max-[700px]:grid-cols-1",
        view === "list" && "grid-cols-1 max-[1050px]:grid-cols-1",
      )}
    >
      <AnimatePresence initial={false}>
        {tasks.map((task, index) => (
          <TaskCard
            key={task.key}
            task={task}
            index={index}
            isUpdating={updatingKeys.has(task.key)}
            onOpen={() => onOpen(task)}
            onAdvance={() => onAdvance(task)}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

const LoadingState = () => {
  return (
    <div
      className="grid grid-cols-3 gap-3 max-[1050px]:grid-cols-2 max-[700px]:grid-cols-1"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Loading consultation queue</span>
      {Array.from({ length: 6 }, (_, index) => (
        <div
          className="min-h-[181px] rounded-[14px] bg-white p-4 shadow-[0_7px_16px_rgba(82,98,171,.06)]"
          key={index}
        >
          <Skeleton className="mb-3 h-3 w-2/3 bg-[#eff2ee]" />
          <Skeleton className="mb-3 h-3 w-full bg-[#eff2ee]" />
          <Skeleton className="mt-12 h-3 w-1/2 bg-[#eff2ee]" />
        </div>
      ))}
    </div>
  )
}

const EmptyState = ({
  filtered,
  onClearFilters,
}: {
  filtered: boolean
  onClearFilters: () => void
}) => {
  const Icon = filtered ? SearchX : ClipboardList
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid min-h-60 place-items-center content-center rounded-xl border border-dashed border-[#d7dfd7] bg-white/60 px-6 text-center"
    >
      <span className="grid size-11 place-items-center rounded-full bg-[#eef2ff] text-[#5972d8]">
        <Icon size={21} />
      </span>
      <h3 className="mt-3 text-sm font-semibold text-[#52635a]">
        {filtered
          ? "No matching consultations"
          : "The consultation queue is clear"}
      </h3>
      <p className="mt-1 max-w-[290px] text-[11px] leading-relaxed text-[#90a098]">
        {filtered
          ? "Try clearing a filter or searching with a different customer name or symptom."
          : "New consultation requests will appear here as they arrive."}
      </p>
      {filtered && (
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={onClearFilters}
        >
          Clear filters
        </Button>
      )}
    </motion.div>
  )
}

const ErrorState = ({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid min-h-60 place-items-center content-center rounded-xl border border-[#f3d5d1] bg-[#fffafa] px-6 text-center"
      role="alert"
    >
      <span className="grid size-11 place-items-center rounded-full bg-[#fff0ed] text-[#e1685b]">
        <TriangleAlert size={21} />
      </span>
      <h3 className="mt-3 text-sm font-semibold text-[#79504a]">
        Unable to load consultations
      </h3>
      <p className="mt-1 max-w-[340px] text-[11px] leading-relaxed text-[#aa756e]">
        {message}. Check that the mock API is running, then try again.
      </p>
      <Button
        size="sm"
        className="mt-4 bg-[#5871d8] hover:bg-[#4e66cd]"
        onClick={onRetry}
      >
        <RefreshCw size={14} />
        Retry
      </Button>
    </motion.div>
  )
}
