export type TaskStatus = "new" | "in_progress" | "completed"

export type RawTaskStatus = TaskStatus | "pending"

export type ServiceType = "video_call" | "voice_call" | "phone_call" | "chat"

export type TaskDataIssue =
  | "duplicate_id"
  | "invalid_id"
  | "invalid_created_at"
  | "invalid_service_type"
  | "invalid_status"

export type RawTask = {
  id: string
  customerName?: string
  serviceType?: ServiceType
  symptom?: string | null
  status?: RawTaskStatus
  createdAt?: string
  completedAt?: string
}

export type ConsultationTask = RawTask & {
  status: TaskStatus
  key: string
  apiId: string
  dataIssues: TaskDataIssue[]
}

export type StatusFilter = "all" | TaskStatus

export type ViewMode = "grid" | "list"

export type DateRangeFilter = "all" | "today" | "this_week" | "custom"
