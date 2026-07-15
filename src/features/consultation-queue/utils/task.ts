import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  MessageCircle,
  PhoneCall,
  Video,
  type LucideIcon,
} from "lucide-react"
import type {
  ConsultationTask,
  DateRangeFilter,
  ServiceType,
  TaskDataIssue,
  TaskStatus,
} from "../types/task"

const SERVICE_TYPES = new Set<ServiceType>([
  "video_call",
  "voice_call",
  "phone_call",
  "chat",
])
const TASK_STATUSES = new Set<TaskStatus>(["new", "in_progress", "completed"])
const STATUS_ORDER: Record<TaskStatus, number> = {
  new: 0,
  in_progress: 1,
  completed: 2,
}

export const STATUS_LABEL: Record<TaskStatus, string> = {
  new: "New",
  in_progress: "In progress",
  completed: "Completed",
}

export const SERVICE_LABEL: Record<ServiceType, string> = {
  video_call: "Video call",
  voice_call: "Voice call",
  phone_call: "Phone call",
  chat: "Chat",
}

export const SERVICE_ICON: Record<ServiceType, LucideIcon> = {
  video_call: Video,
  voice_call: PhoneCall,
  phone_call: PhoneCall,
  chat: MessageCircle,
}

export const STATUS_ICON: Record<TaskStatus, LucideIcon> = {
  new: AlertTriangle,
  in_progress: Clock3,
  completed: CheckCircle2,
}

export const DATA_ISSUE_LABEL: Record<TaskDataIssue, string> = {
  duplicate_id: "Duplicate task ID — status update is unavailable.",
  invalid_id: "Missing or invalid task ID — status update is unavailable.",
  invalid_created_at: "Invalid received date — excluded from date filters.",
  invalid_service_type: "Unknown service type — showing a safe fallback.",
  invalid_status: "Unknown status — treated as New.",
}

type Candidate = Omit<ConsultationTask, "key" | "dataIssues"> & {
  dataIssues: TaskDataIssue[]
}

export const normalizeTasks = (payload: unknown): ConsultationTask[] => {
  if (!Array.isArray(payload))
    throw new Error("The consultation service returned an invalid task list.")

  const candidates = payload.map(toCandidate)
  const idCount = new Map<string, number>()
  candidates.forEach((task) => {
    if (task.apiId) idCount.set(task.apiId, (idCount.get(task.apiId) ?? 0) + 1)
  })
  const identityCount = new Map<string, number>()

  return candidates.map((task) => {
    const identity = [
      task.id,
      task.customerName ?? "",
      task.createdAt ?? "",
      task.serviceType ?? "",
    ].join("|")
    const occurrence = (identityCount.get(identity) ?? 0) + 1
    identityCount.set(identity, occurrence)
    const dataIssues = [...task.dataIssues]
    if (task.apiId && (idCount.get(task.apiId) ?? 0) > 1)
      dataIssues.unshift("duplicate_id")

    return {
      ...task,
      key: `task-${stableHash(identity)}-${occurrence}`,
      dataIssues,
    }
  })
}

const toCandidate = (value: unknown, index: number): Candidate => {
  const record = isRecord(value) ? value : {}
  const dataIssues: TaskDataIssue[] = []
  const rawId =
    typeof record.id === "string" || typeof record.id === "number"
      ? String(record.id).trim()
      : ""
  const apiId = rawId
  const id =
    rawId || `invalid-${stableHash(`${index}|${safeStringify(record)}`)}`
  if (!rawId) dataIssues.push("invalid_id")

  const serviceType = isServiceType(record.serviceType)
    ? record.serviceType
    : undefined
  if (record.serviceType !== undefined && !serviceType)
    dataIssues.push("invalid_service_type")

  const status =
    record.status === "pending"
      ? "new"
      : isTaskStatus(record.status)
        ? record.status
        : "new"
  if (
    record.status !== undefined &&
    record.status !== "pending" &&
    !isTaskStatus(record.status)
  ) {
    dataIssues.push("invalid_status")
  }

  const createdAt =
    typeof record.createdAt === "string" ? record.createdAt : undefined
  if (!createdAt || Number.isNaN(new Date(createdAt).getTime()))
    dataIssues.push("invalid_created_at")

  return {
    id,
    apiId,
    customerName:
      typeof record.customerName === "string" ? record.customerName : undefined,
    serviceType,
    symptom:
      typeof record.symptom === "string" || record.symptom === null
        ? record.symptom
        : null,
    status,
    createdAt,
    completedAt:
      typeof record.completedAt === "string" ? record.completedAt : undefined,
    dataIssues,
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

const isServiceType = (value: unknown): value is ServiceType => {
  return typeof value === "string" && SERVICE_TYPES.has(value as ServiceType)
}

const isTaskStatus = (value: unknown): value is TaskStatus => {
  return typeof value === "string" && TASK_STATUSES.has(value as TaskStatus)
}

const safeStringify = (value: unknown): string => {
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

const stableHash = (value: string): string => {
  let hash = 5381
  for (const character of value) hash = (hash * 33) ^ character.charCodeAt(0)
  return (hash >>> 0).toString(36)
}

export const getDisplayStatus = (task: ConsultationTask): TaskStatus => {
  return task.status
}

export const getNextStatus = (task: ConsultationTask): TaskStatus => {
  const status = getDisplayStatus(task)
  return status === "new" ? "in_progress" : "completed"
}

export const hasBlockingDataIssue = (task: ConsultationTask): boolean => {
  return (
    task.dataIssues.includes("duplicate_id") ||
    task.dataIssues.includes("invalid_id")
  )
}

export const taskDataIssueMessages = (task: ConsultationTask): string[] => {
  return task.dataIssues.map((issue) => DATA_ISSUE_LABEL[issue])
}

export const matchesService = (
  task: ConsultationTask,
  service: string,
): boolean => {
  if (service === "all") return true
  if (service === "voice_call")
    return (
      task.serviceType === "voice_call" || task.serviceType === "phone_call"
    )
  return task.serviceType === service
}

export const matchesDateRange = (
  task: ConsultationTask,
  range: DateRangeFilter,
  from?: string,
  to?: string,
): boolean => {
  if (range === "all") return true
  const createdAt = task.createdAt ? new Date(task.createdAt) : null
  if (!createdAt || Number.isNaN(createdAt.getTime())) return false

  const startOfDay = (value: Date) =>
    new Date(value.getFullYear(), value.getMonth(), value.getDate())
  const today = startOfDay(new Date())
  const taskDay = startOfDay(createdAt)

  if (range === "today") return taskDay.getTime() === today.getTime()
  if (range === "this_week") {
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7))
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    return taskDay >= weekStart && taskDay <= weekEnd
  }

  const fromDate = from ? startOfDay(new Date(`${from}T00:00:00`)) : null
  const toDate = to ? startOfDay(new Date(`${to}T00:00:00`)) : null
  if (fromDate && Number.isNaN(fromDate.getTime())) return false
  if (toDate && Number.isNaN(toDate.getTime())) return false
  return (!fromDate || taskDay >= fromDate) && (!toDate || taskDay <= toDate)
}

export const compareTasks = (
  firstTask: ConsultationTask,
  secondTask: ConsultationTask,
): number => {
  const statusDifference =
    STATUS_ORDER[getDisplayStatus(firstTask)] -
    STATUS_ORDER[getDisplayStatus(secondTask)]
  if (statusDifference !== 0) return statusDifference

  return taskTimestamp(secondTask) - taskTimestamp(firstTask)
}

const taskTimestamp = (task: ConsultationTask): number => {
  const timestamp = task.createdAt
    ? new Date(task.createdAt).getTime()
    : Number.NaN
  return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp
}

export const taskTime = (value?: string): string => {
  const date = value ? new Date(value) : null
  if (!date || Number.isNaN(date.getTime())) return "Time unavailable"
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export const taskDateTime = (value?: string): string => {
  const date = value ? new Date(value) : null
  if (!date || Number.isNaN(date.getTime())) return "Date and time unavailable"
  const day = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
  return `${day} · ${time}`
}

export const customerInitials = (name?: string): string => {
  return (name || "Unknown")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export const customerName = (name?: string): string => {
  return name?.trim() || "Unknown customer"
}
