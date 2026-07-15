import { axiosInstance } from "@/shared/lib/axios-instance"
import type { ConsultationTask, TaskStatus } from "../types/task"
import { normalizeTasks } from "../utils/task"

export const taskService = {
  getTasks: async (): Promise<ConsultationTask[]> => {
    const response = await axiosInstance.get<{ data: ConsultationTask[] }>(
      "/api/v1/tasks",
    )
    return normalizeTasks(response.data?.data)
  },
  updateStatus: async (taskId: string, status: TaskStatus): Promise<void> => {
    await axiosInstance.patch(
      `/api/v1/tasks/${encodeURIComponent(taskId)}`,
      { status },
    )
  },
}
