import { axiosInstance } from "@/shared/lib/axios-instance"
import { ConsultationTask } from "../types/task"
import { normalizeTasks } from "../utils/task"

export const taskService = {
  getTasks: async (): Promise<ConsultationTask[]> => {
    const response = await axiosInstance.get<unknown>("/api/v1/tasks")
    return normalizeTasks(response.data)
  },
}
