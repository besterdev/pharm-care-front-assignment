import { useEffect, useMemo, useRef, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "../lib/api-client"
import { getDisplayStatus, getNextStatus, normalizeTasks } from "../lib/task"
import type { ConsultationTask, TaskStatus } from "../types/task"

const tasksQueryKey = ["tasks"] as const
const statusMutationKey = ["tasks", "status"] as const
const liveQueuePollMs = 15_000
const emptyTasks: ConsultationTask[] = []

const fetchTasks = async (): Promise<ConsultationTask[]> => {
  const response = await apiClient.get<unknown>("/tasks")
  return normalizeTasks(response.data)
}

export const useTasks = () => {
  const queryClient = useQueryClient()
  const tasksQuery = useQuery({
    queryKey: tasksQueryKey,
    queryFn: fetchTasks,
    refetchInterval: liveQueuePollMs,
    refetchIntervalInBackground: true,
  })
  const tasks = tasksQuery.data ?? emptyTasks
  const knownTaskKeys = useRef(new Set<string>())
  const hasReceivedInitialQueue = useRef(false)
  const updatingKeysRef = useRef(new Set<string>())
  const [incomingTaskCount, setIncomingTaskCount] = useState(0)
  const [updatingKeys, setUpdatingKeys] = useState<ReadonlySet<string>>(
    () => new Set(),
  )

  useEffect(() => {
    if (!tasksQuery.isSuccess) return

    const currentKeys = new Set(tasks.map((task) => task.key))

    if (!hasReceivedInitialQueue.current) {
      knownTaskKeys.current = currentKeys
      hasReceivedInitialQueue.current = true
      return
    }

    const additions = tasks.filter(
      (task) => !knownTaskKeys.current.has(task.key),
    ).length

    if (additions) setIncomingTaskCount((count) => count + additions)
    knownTaskKeys.current = currentKeys
  }, [tasks, tasksQuery.isSuccess])

  const statusMutation = useMutation({
    mutationKey: statusMutationKey,
    mutationFn: async (task: ConsultationTask) => {
      const nextStatus = getNextStatus(task)
      await apiClient.patch(`/tasks/${encodeURIComponent(task.apiId)}`, {
        status: nextStatus,
      })
      return { key: task.key, nextStatus }
    },
    onMutate: async (task) => {
      await queryClient.cancelQueries({ queryKey: tasksQueryKey })
      const previousTask = queryClient
        .getQueryData<ConsultationTask[]>(tasksQueryKey)
        ?.find((item) => item.key === task.key)
      queryClient.setQueryData<ConsultationTask[]>(
        tasksQueryKey,
        (current = []) =>
          current.map((item) =>
            item.key === task.key
              ? { ...item, status: getNextStatus(task) }
              : item,
          ),
      )
      return { previousTask }
    },
    onError: (_error, task, context) => {
      if (!context?.previousTask) return
      const previousTask = context.previousTask
      queryClient.setQueryData<ConsultationTask[]>(
        tasksQueryKey,
        (current = []) =>
          current.map((item) => (item.key === task.key ? previousTask : item)),
      )
    },
    onSettled: () => {
      if (queryClient.isMutating({ mutationKey: statusMutationKey }) === 1) {
        void queryClient.invalidateQueries({ queryKey: tasksQueryKey })
      }
    },
  })

  const counts = useMemo(
    () =>
      tasks.reduce(
        (result, task) => {
          result.all += 1
          result[getDisplayStatus(task)] += 1
          return result
        },
        { all: 0, new: 0, in_progress: 0, completed: 0 },
      ),
    [tasks],
  )
  const dataQualityIssueCount = useMemo(
    () => tasks.reduce((count, task) => count + task.dataIssues.length, 0),
    [tasks],
  )

  const updateStatus = async (task: ConsultationTask): Promise<TaskStatus> => {
    if (updatingKeysRef.current.has(task.key))
      throw new Error("This consultation is already updating.")
    updatingKeysRef.current.add(task.key)
    setUpdatingKeys(new Set(updatingKeysRef.current))
    try {
      const result = await statusMutation.mutateAsync(task)
      return result.nextStatus
    } finally {
      updatingKeysRef.current.delete(task.key)
      setUpdatingKeys(new Set(updatingKeysRef.current))
    }
  }

  return {
    tasks,
    counts,
    dataQualityIssueCount,
    isLoading: tasksQuery.isPending,
    isError: tasksQuery.isError,
    errorMessage:
      tasksQuery.error instanceof Error
        ? tasksQuery.error.message
        : "The consultation service is unavailable.",
    isRefreshing: tasksQuery.isFetching && !tasksQuery.isPending,
    incomingTaskCount,
    dismissIncomingTasks: () => setIncomingTaskCount(0),
    liveQueuePollMs,
    updatingKeys,
    refresh: tasksQuery.refetch,
    updateStatus,
  }
}
