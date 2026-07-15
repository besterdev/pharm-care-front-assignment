import { axiosInstance } from "@/shared/lib/axios-instance"
import type { ConsultationTask, TaskStatus } from "../types/task"
import { normalizeTasks } from "../utils/task"

const tasksEndpoint = import.meta.env.DEV ? "/tasks" : "/api/v1/tasks"

const getTaskList = (payload: unknown): unknown => {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload &&
    Array.isArray(payload.data)
  ) {
    return payload.data
  }

  return payload
}

export const taskService = {
  getTasks: async (): Promise<ConsultationTask[]> => {
    const response = await axiosInstance.get<unknown>(tasksEndpoint)
    return normalizeTasks(getTaskList(response.data))
  },
  updateStatus: async (taskId: string, status: TaskStatus): Promise<void> => {
    await axiosInstance.patch(
      `${tasksEndpoint}/${encodeURIComponent(taskId)}`,
      { status },
    )
  },
}
