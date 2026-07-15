import { CheckCircle2, TriangleAlert } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

export type ActionNotice = {
  kind: "success" | "error"
  message: string
}

type Props = {
  incomingTaskCount: number
  notice: ActionNotice | null
  onViewIncomingTasks: () => void
}

export const QueueNotifications = ({
  incomingTaskCount,
  notice,
  onViewIncomingTasks,
}: Props) => (
  <>
    <AnimatePresence>
      {incomingTaskCount > 0 && (
        <motion.div
          className="fixed bottom-6 right-6 z-50 max-sm:bottom-4 max-sm:right-3 max-sm:max-w-[calc(100vw-86px)]"
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
        >
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-[#405bca] px-4 py-3 text-[11px] font-semibold text-white shadow-[0_12px_30px_rgba(23,37,33,.22)] transition hover:bg-[#334eaf] max-sm:px-3"
            onClick={onViewIncomingTasks}
            aria-label={`View ${incomingTaskCount} new consultation${incomingTaskCount > 1 ? "s" : ""}`}
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#84e4a9] opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-[#84e4a9]" />
            </span>
            {incomingTaskCount} new consultation
            {incomingTaskCount > 1 ? "s" : ""} received
            <span className="ml-1 rounded bg-white/15 px-1.5 py-0.5 text-white/90">
              View new tasks
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
    <AnimatePresence>
      {notice && (
        <motion.div
          className={`fixed bottom-6 left-1/2 z-50 flex max-w-[calc(100vw-28px)] -translate-x-1/2 items-center gap-2 rounded-lg px-4 py-3 text-[11px] shadow-[0_12px_30px_rgba(23,37,33,.22)] ${notice.kind === "success" ? "bg-[#405bca] text-[#eef4ee]" : "border border-[#f0b2aa] bg-[#fff7f5] text-[#994a42]"}`}
          role={notice.kind === "error" ? "alert" : "status"}
          aria-live="polite"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
        >
          {notice.kind === "success" ? (
            <CheckCircle2 className="text-[#79d29c]" size={16} />
          ) : (
            <TriangleAlert className="text-[#dc695d]" size={16} />
          )}
          {notice.message}
        </motion.div>
      )}
    </AnimatePresence>
  </>
)
