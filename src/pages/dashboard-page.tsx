import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { DataQualityAlert } from "@/features/consultation-queue/components/data-quality-alert"
import {
  ProfilePanel,
  TodayPanel,
  WelcomePanel,
} from "@/features/consultation-queue/components/overview-panels"
import {
  QueueNotifications,
  type ActionNotice,
} from "@/features/consultation-queue/components/queue-notifications"
import { QueueStats } from "@/features/consultation-queue/components/queue-stats"
import { TaskFilters } from "@/features/consultation-queue/components/task-filters"
import { TaskList } from "@/features/consultation-queue/components/task-list"
import { ViewSwitcher } from "@/features/consultation-queue/components/view-switcher"
import { useTasks } from "@/features/consultation-queue/hooks/use-tasks"
import { useQueueFilters } from "@/features/consultation-queue/hooks/use-queue-filters"
import {
  compareTasks,
  getDisplayStatus,
  matchesDateRange,
  matchesService,
  STATUS_LABEL,
} from "@/features/consultation-queue/utils/task"
import type {
  ConsultationTask,
  ViewMode,
} from "@/features/consultation-queue/types/task"
import { DashboardLayout } from "@/layouts/dashboard-layout"
import { useDebouncedValue } from "@/shared/hooks/use-debounced-value"

const TaskDetails = lazy(() =>
  import("@/features/consultation-queue/components/task-details").then(
    (module) => ({
      default: module.TaskDetails,
    }),
  ),
)

export const DashboardPage = () => {
  const {
    tasks,
    counts,
    isLoading,
    isError,
    errorMessage,
    isRefreshing,
    dataQualityIssueCount,
    incomingTaskCount,
    dismissIncomingTasks,
    updatingKeys,
    refresh,
    updateStatus,
  } = useTasks()
  const {
    filters,
    setQuery,
    setService,
    setStatus,
    setDateRange,
    setFromDate,
    setToDate,
    resetFilters,
  } = useQueueFilters()
  const { query, service, status, dateRange, fromDate, toDate } = filters
  const [view, setView] = useState<ViewMode>("grid")
  const [selectedTaskKey, setSelectedTaskKey] = useState<string | null>(null)
  const [notice, setNotice] = useState<ActionNotice | null>(null)
  const noticeTimerRef = useRef<number | null>(null)
  const queueHeadingRef = useRef<HTMLDivElement>(null)
  const debouncedQuery = useDebouncedValue(query.trim().toLowerCase(), 300)
  const selectedTask = useMemo(
    () => tasks.find((task) => task.key === selectedTaskKey) ?? null,
    [tasks, selectedTaskKey],
  )

  useEffect(
    () => () => {
      if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current)
    },
    [],
  )

  const showNotice = useCallback(
    (nextNotice: { kind: "success" | "error"; message: string }) => {
      if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current)
      setNotice(nextNotice)
      noticeTimerRef.current = window.setTimeout(() => setNotice(null), 4200)
    },
    [],
  )

  const visibleTasks = useMemo(
    () =>
      tasks
        .filter((task) => {
          const customerName = task.customerName?.toLowerCase() ?? ""
          return (
            (!debouncedQuery || customerName.includes(debouncedQuery)) &&
            (status === "all" || getDisplayStatus(task) === status) &&
            matchesService(task, service) &&
            matchesDateRange(task, dateRange, fromDate, toDate)
          )
        })
        .sort(compareTasks),
    [tasks, debouncedQuery, status, service, dateRange, fromDate, toDate],
  )

  const advanceTask = async (task: ConsultationTask) => {
    try {
      const next = await updateStatus(task)
      showNotice({
        kind: "success",
        message: `${task.customerName?.trim() || "Task"} moved to ${STATUS_LABEL[next]}`,
      })
    } catch {
      showNotice({
        kind: "error",
        message:
          "Unable to update this consultation. Your change was not saved—please retry.",
      })
    }
  }

  const viewIncomingTasks = () => {
    dismissIncomingTasks()
    resetFilters()
    setStatus("new")
    window.requestAnimationFrame(() =>
      queueHeadingRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      }),
    )
  }

  return (
    <>
      <DashboardLayout
        isError={isError}
        isRefreshing={isRefreshing}
        onRefresh={() => void refresh()}
      >
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_286px]">
          <div className="space-y-5 lg:col-start-1">
            <WelcomePanel newTasks={counts.new} />
            <QueueStats counts={counts} />
            <DataQualityAlert issueCount={dataQualityIssueCount} />
          </div>
          <aside
            className="grid grid-cols-2 gap-5 max-[680px]:grid-cols-1 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:grid-cols-1"
            aria-label="Pharmacist profile and today’s plan"
          >
            <ProfilePanel />
            <TodayPanel inProgress={counts.in_progress} />
          </aside>
          <section className="w-full lg:col-start-1">
            <div
              className="mb-5 flex items-end justify-between gap-3 max-[480px]:items-center"
              ref={queueHeadingRef}
            >
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[.11em] text-[#7d86af]">
                  Incoming requests
                </p>
                <h2 className="mt-2 text-[21px] font-semibold tracking-[-.7px] text-[#464e6d]">
                  Consultation queue{" "}
                  <span className="font-mono text-[10px] text-[#7d86af]">
                    {visibleTasks.length}
                  </span>
                </h2>
              </div>
              <ViewSwitcher view={view} onChange={setView} />
            </div>
            <TaskFilters
              query={query}
              service={service}
              status={status}
              dateRange={dateRange}
              fromDate={fromDate}
              toDate={toDate}
              onQueryChange={setQuery}
              onServiceChange={setService}
              onStatusChange={setStatus}
              onDateRangeChange={setDateRange}
              onFromDateChange={setFromDate}
              onToDateChange={setToDate}
              onReset={resetFilters}
            />
            <TaskList
              tasks={visibleTasks}
              view={view}
              isLoading={isLoading}
              isError={isError}
              errorMessage={errorMessage}
              hasActiveFilters={Boolean(
                query ||
                service !== "all" ||
                status !== "all" ||
                dateRange !== "all",
              )}
              updatingKeys={updatingKeys}
              onOpen={(task) => setSelectedTaskKey(task.key)}
              onAdvance={(task) => void advanceTask(task)}
              onRetry={() => void refresh()}
              onClearFilters={resetFilters}
            />
          </section>
        </div>
      </DashboardLayout>
      <Suspense fallback={null}>
        <TaskDetails
          task={selectedTask}
          isUpdating={selectedTask ? updatingKeys.has(selectedTask.key) : false}
          onClose={() => setSelectedTaskKey(null)}
          onAdvance={() => selectedTask && void advanceTask(selectedTask)}
        />
      </Suspense>
      <QueueNotifications
        incomingTaskCount={incomingTaskCount}
        notice={notice}
        onViewIncomingTasks={viewIncomingTasks}
      />
    </>
  )
}
