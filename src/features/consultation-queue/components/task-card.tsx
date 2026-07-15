import { ArrowRight, Clock3, DatabaseZap } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  customerInitials,
  customerName,
  getDisplayStatus,
  hasBlockingDataIssue,
  SERVICE_ICON,
  SERVICE_LABEL,
  taskDataIssueMessages,
  taskTime,
} from "../utils/task"
import type { ConsultationTask } from "../types/task"
import { StatusBadge } from "./status-badge"

type Props = {
  task: ConsultationTask
  index: number
  isUpdating: boolean
  onOpen: () => void
  onAdvance: () => void
}

export const TaskCard = ({
  task,
  index,
  isUpdating,
  onOpen,
  onAdvance,
}: Props) => {
  const ServiceIcon = task.serviceType ? SERVICE_ICON[task.serviceType] : Clock3
  const status = getDisplayStatus(task)
  const isUpdateBlocked = hasBlockingDataIssue(task)
  const isCompleted = status === "completed"

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.035 }}
      whileHover={{ y: -2 }}
    >
      <Card className="relative flex min-h-[181px] flex-col rounded-[14px] border-0 p-4 shadow-[0_7px_16px_rgba(82,98,171,.06)] transition-shadow hover:shadow-[0_12px_25px_rgba(72,93,180,.15)]">
        <button
          type="button"
          className="absolute inset-0 z-0 cursor-pointer rounded-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#6679ce]"
          onClick={onOpen}
          aria-label={`Open consultation for ${customerName(task.customerName)}`}
        />
        <div className="pointer-events-none relative z-10 flex flex-1 flex-col">
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <Avatar className="size-[34px] bg-[#d8e5dc] font-mono text-[10px] text-[#466354]">
                <AvatarFallback className="bg-transparent text-inherit">
                  {customerInitials(task.customerName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="max-w-[150px] truncate text-[12px] font-semibold text-[#3f4868]">
                  {customerName(task.customerName)}
                </h3>
                <span className="mt-1 flex items-center gap-1 text-[10px] text-[#7d86a3]">
                  <ServiceIcon size={13} />
                  {task.serviceType
                    ? SERVICE_LABEL[task.serviceType]
                    : "Service unavailable"}
                </span>
              </div>
            </div>
            <StatusBadge task={task} />
          </div>

          <p className="mb-3 mt-4 min-h-[40px] text-[13px] font-medium leading-relaxed text-[#59637f]">
            {task.symptom || "No symptom details provided"}
          </p>

          {task.dataIssues.length > 0 && (
            <div
              className="mb-3 flex items-start gap-1.5 rounded-lg bg-[#fff8ed] px-2.5 py-2 text-[10px] leading-relaxed text-[#936323]"
              role="note"
            >
              <DatabaseZap className="mt-px shrink-0" size={13} />
              <span>{taskDataIssueMessages(task).join(" ")}</span>
            </div>
          )}

          <div className="mt-auto">
            <Separator className="bg-[#eef0f7]" />
            <div className="flex items-center justify-between gap-2 pt-3">
              <span className="inline-flex items-center gap-1 text-[10px] text-[#7d86a3]">
                <Clock3 size={13} />
                Received {taskTime(task.createdAt)}
              </span>
              {isCompleted ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="pointer-events-auto px-1 text-[#5c72d2] hover:bg-transparent hover:text-[#405bc9]"
                  onClick={onOpen}
                >
                  View details <ArrowRight size={14} />
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="pointer-events-auto h-8 bg-[#405bca] px-2.5 text-[10px] shadow-none hover:bg-[#334eaf]"
                  onClick={onAdvance}
                  disabled={isUpdating || isUpdateBlocked}
                  title={
                    isUpdateBlocked
                      ? "Fix the task ID before updating this consultation."
                      : undefined
                  }
                >
                  {isUpdating
                    ? "Updating…"
                    : isUpdateBlocked
                      ? "Update unavailable"
                      : status === "new"
                        ? "Start review"
                        : "Mark complete"}
                  {!isUpdateBlocked && <ArrowRight size={14} />}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
