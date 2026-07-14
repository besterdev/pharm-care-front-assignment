import { ArrowRight, Check, Clock3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import {
  customerInitials,
  customerName,
  getDisplayStatus,
  getNextStatus,
  hasBlockingDataIssue,
  SERVICE_LABEL,
  taskDataIssueMessages,
  taskDateTime,
} from "@/lib/task"
import type { ConsultationTask } from "@/types/task"
import { StatusBadge } from "./status-badge"

type Props = {
  task: ConsultationTask | null
  isUpdating: boolean
  onClose: () => void
  onAdvance: () => void
}

export const TaskDetails = ({
  task,
  isUpdating,
  onClose,
  onAdvance,
}: Props) => {
  if (!task) return null
  const status = getDisplayStatus(task)
  const nextAction =
    getNextStatus(task) === "in_progress" ? "Start review" : "Mark complete"
  const isUpdateBlocked = hasBlockingDataIssue(task)

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full max-w-[440px] gap-0 overflow-y-auto border-0 bg-[#fbfcff] p-0 text-[#4d5675] sm:max-w-[440px] max-sm:top-auto max-sm:h-[min(90dvh,700px)] max-sm:max-w-none max-sm:rounded-t-[18px]"
      >
        <SheetHeader className="px-7 pb-0 pt-7 max-sm:px-[18px] max-sm:pt-[22px]">
          <p className="font-mono text-[9px] uppercase tracking-[.12em] text-[#7d86a7]">
            Consultation details
          </p>
          <SheetTitle className="mt-2 text-[24px] font-semibold tracking-[-.9px] text-[#37415f]">
            {customerName(task.customerName)}
          </SheetTitle>
        </SheetHeader>
        <div className="px-7 max-sm:px-[18px]">
          <div className="flex items-center gap-3 py-6">
            <Avatar className="size-12 bg-[#e1e8ff] font-mono text-[13px] text-[#526bd1]">
              <AvatarFallback className="bg-transparent text-inherit">
                {customerInitials(task.customerName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <span className="block text-[11px] font-medium text-[#626d90]">
                {task.serviceType
                  ? SERVICE_LABEL[task.serviceType]
                  : "Service unavailable"}
              </span>
              <span className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[#8993b0]">
                <Clock3 size={13} className="shrink-0 text-[#647ee2]" />
                Received {taskDateTime(task.createdAt)}
              </span>
            </div>
          </div>
          <Separator className="bg-[#e7eafa]" />
          <div className="flex items-center justify-between py-5">
            <span className="text-[11px] font-medium text-[#74809e]">
              Status
            </span>
            <StatusBadge task={task} />
          </div>
          <Separator className="bg-[#e7eafa]" />
          <section className="py-5">
            <p className="font-mono text-[9px] uppercase tracking-[.12em] text-[#7d86a7]">
              Reason for consultation
            </p>
            <strong className="mt-2.5 block text-[13px] font-medium leading-relaxed text-[#4b5674]">
              {task.symptom || "No symptom details provided by customer."}
            </strong>
          </section>
          <Separator className="bg-[#e7eafa]" />
          {task.dataIssues.length > 0 && (
            <>
              <section className="py-5" aria-label="Data quality issue">
                <p className="font-mono text-[9px] uppercase tracking-[.12em] text-[#9b6b29]">
                  Data quality
                </p>
                <ul className="mt-2 grid list-disc gap-1 pl-4 text-[11px] leading-relaxed text-[#8b6530]">
                  {taskDataIssueMessages(task).map((message) => (
                    <li key={message}>{message}</li>
                  ))}
                </ul>
              </section>
              <Separator className="bg-[#e7eafa]" />
            </>
          )}
          <section className="py-5">
            <p className="font-mono text-[9px] uppercase tracking-[.12em] text-[#7d86a7]">
              Workflow
            </p>
            <div className="relative mt-4 grid gap-4 before:absolute before:bottom-3 before:left-[11px] before:top-3 before:w-px before:bg-[#dce3fb]">
              <WorkflowStep label="Request received" complete />
              <WorkflowStep
                label="Pharmacist review"
                active={status === "new"}
                complete={status !== "new"}
              />
              <WorkflowStep
                label="Consultation complete"
                complete={status === "completed"}
              />
            </div>
          </section>
        </div>
        <SheetFooter className="sticky bottom-0 flex-row justify-end gap-2 border-t border-[#e7eafa] bg-[#fbfcff]/95 px-7 pb-7 pt-4 backdrop-blur-sm max-sm:px-[18px] max-sm:pb-5">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={onAdvance}
            disabled={isUpdating || status === "completed" || isUpdateBlocked}
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
                : nextAction}
            {!isUpdateBlocked && <ArrowRight size={16} />}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

const WorkflowStep = ({
  label,
  active,
  complete,
}: {
  label: string
  active?: boolean
  complete?: boolean
}) => {
  return (
    <div
      className={cn(
        "relative z-10 flex items-center gap-3 text-[11px] text-[#99a2bb]",
        active && "font-bold text-[#5367b8]",
        complete && "text-[#526fc8]",
      )}
    >
      <i
        className={cn(
          "grid size-[23px] place-items-center rounded-full border border-[#d6ddef] bg-[#fbfcff] font-mono text-[10px] not-italic",
          active && "border-[#6b7fe0] bg-[#f1f3ff] text-[#566dd4]",
          complete && "border-[#cdd8ff] bg-[#e8edff] text-[#536dd0]",
        )}
      >
        {complete ? <Check size={13} /> : active ? "2" : "3"}
      </i>
      <span>{label}</span>
    </div>
  )
}
