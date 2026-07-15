import { CheckCircle2, Clock3, Inbox } from "lucide-react"
import { motion } from "framer-motion"

type Counts = { new: number; in_progress: number; completed: number }
const stats = [
  {
    key: "new",
    label: "Needs attention",
    detail: "new requests waiting",
    Icon: Inbox,
    icon: "bg-[#fff0f1] text-[#ee7b79]",
  },
  {
    key: "in_progress",
    label: "In progress",
    detail: "being reviewed now",
    Icon: Clock3,
    icon: "bg-[#e7f8f4] text-[#49a48c]",
  },
  {
    key: "completed",
    label: "Completed",
    detail: "consultations resolved",
    Icon: CheckCircle2,
    icon: "bg-[#ececff] text-[#6b72d4]",
  },
] as const
export const QueueStats = ({ counts }: { counts: Counts }) => (
  <section
    className="my-[18px] grid grid-cols-3 gap-3 max-[720px]:grid-cols-2 max-[470px]:grid-cols-1 max-sm:mb-6"
    aria-label="Queue summary"
  >
    {stats.map(({ key, label, detail, Icon, icon }, index) => (
      <motion.div
        key={key}
        className="flex min-h-[106px] gap-3 rounded-[14px] bg-white p-4 shadow-[0_8px_18px_rgba(82,98,171,.07)] max-sm:min-h-24 max-sm:p-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.06 }}
      >
        <div
          className={`grid size-8 shrink-0 place-items-center rounded-lg ${icon} max-sm:hidden`}
        >
          <Icon size={17} />
        </div>
        <div>
          <p className="m-0 text-[9px] uppercase text-[#8389aa]">{label}</p>
          <strong className="my-1 block text-[27px] leading-none tracking-[-1px] text-[#3d4568]">
            {counts[key]}
          </strong>
          <span className="text-[9px] text-[#a5a9bf]">{detail}</span>
        </div>
      </motion.div>
    ))}
  </section>
)
