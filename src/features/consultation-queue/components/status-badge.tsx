import { Badge } from "@/components/ui/badge"
import { getDisplayStatus, STATUS_ICON, STATUS_LABEL } from "../utils/task"
import { cn } from "@/shared/utils/cn"
import type { ConsultationTask } from "../types/task"

const colors = {
  new: "bg-[#fff0ed] text-[#dc7767]",
  in_progress: "bg-[#e8f8f2] text-[#4d9c81]",
  completed: "bg-[#edeeff] text-[#6d75bd]",
}

export const StatusBadge = ({ task }: { task: ConsultationTask }) => {
  const status = getDisplayStatus(task)
  const Icon = STATUS_ICON[status]
  return (
    <Badge
      className={cn(
        "gap-1 whitespace-nowrap border-0 font-mono text-[9px]",
        colors[status],
      )}
    >
      <Icon size={12} strokeWidth={2.1} />
      {STATUS_LABEL[status]}
    </Badge>
  )
}
