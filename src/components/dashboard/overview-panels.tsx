import {
  CalendarDays,
  ChevronRight,
  MapPin,
  Pencil,
  Stethoscope,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

const railHeader =
  "flex h-14 items-center justify-between bg-gradient-to-r from-[#4e6bd6] to-[#6680e6] px-4 text-white"
const railIcon = "grid size-7 place-items-center rounded-md bg-white/20"
const pharmacist = {
  name: "Mai P.",
  initials: "MP",
  role: "Lead pharmacist",
  location: "Bangkok, Thailand",
  shift: "08:00–16:00",
  queue: "Telepharmacy",
} as const
const schedule = [
  {
    time: "10:45",
    title: "Video consultation",
    customer: "Somchai Prasert",
    color: "bg-[#647ee2]",
  },
  {
    time: "11:15",
    title: "Medication review",
    customer: "Thanet Kittisak",
    color: "bg-[#ed94c7]",
  },
  {
    time: "11:45",
    title: "Follow-up call",
    customer: "Manop Rakdee",
    color: "bg-[#65c7a1]",
  },
] as const

export const WelcomePanel = ({ newTasks }: { newTasks: number }) => {
  const now = new Date()
  const greeting = getGreeting(now)
  const dateTime = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(now)

  return (
    <section className="relative flex min-h-40 items-center overflow-hidden rounded-[19px] bg-gradient-to-r from-[#4e6bd6] to-[#6680e6] px-7 py-6 text-white shadow-[0_12px_27px_rgba(79,103,205,0.21)] max-[480px]:min-h-44 max-[480px]:px-5">
      <div className="relative z-10 max-[480px]:max-w-[210px]">
        <time className="inline-flex items-center gap-1.5 rounded-md bg-white/20 px-2.5 py-1.5 font-mono text-[9px]">
          <CalendarDays size={13} />
          {dateTime}
        </time>
        <h2 className="mt-4 text-[25px] font-semibold tracking-[-1px] max-[480px]:text-[22px]">
          Good {greeting}, {pharmacist.name.split(" ")[0]}!
        </h2>
        <p className="mt-1 text-[11px] text-[#e8ecff]">
          You have{" "}
          <strong className="text-white">{newTasks} new consultations</strong>{" "}
          waiting for review.
        </p>
      </div>
      <div
        className="absolute -bottom-6 right-10 grid size-40 rotate-[-6deg] place-items-center text-white max-sm:-right-2 max-sm:scale-75"
        aria-hidden="true"
      >
        <i className="absolute size-36 rounded-full border border-white/30" />
        <i className="absolute size-[105px] rounded-full border border-dashed border-white/30" />
        <Stethoscope
          className="relative drop-shadow-sm"
          size={96}
          strokeWidth={1.25}
        />
      </div>
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(120deg,transparent_0_52%,rgba(255,255,255,.18)_52.2%,transparent_52.6%)]" />
    </section>
  )
}

export const ProfilePanel = () => {
  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_18px_rgba(82,98,171,.07)]">
      <div className={railHeader}>
        <span className="text-[10px] font-bold uppercase tracking-[.06em]">
          My profile
        </span>
        <span className={railIcon} aria-hidden="true">
          <Pencil size={14} />
        </span>
      </div>
      <div className="flex items-center gap-3 px-4 py-5">
        <Avatar
          size="lg"
          className="size-16 border-4 border-[#e8ecff] bg-[#cfe8f3] font-mono text-base text-[#526dd0]"
        >
          <AvatarFallback className="bg-transparent text-inherit">
            {pharmacist.initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-[15px] font-semibold text-[#414966]">
            {pharmacist.name}
          </h2>
          <p className="my-1 text-[10px] text-[#767f9e]">{pharmacist.role}</p>
          <span className="flex items-center gap-1 text-[9px] text-[#9da4b9]">
            <MapPin size={13} className="text-[#5470d6]" />
            {pharmacist.location}
          </span>
        </div>
      </div>
      <Separator className="bg-[#eff0f7]" />
      <div className="grid grid-cols-2 divide-x divide-[#eff0f7]">
        <ProfileMeta label="Shift" value={pharmacist.shift} />
        <ProfileMeta label="Queue" value={pharmacist.queue} />
      </div>
    </section>
  )
}

const ProfileMeta = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="px-4 py-3">
      <span className="block text-[9px] text-[#a0a7bb]">{label}</span>
      <strong className="mt-1 block text-[10px] text-[#4d5675]">{value}</strong>
    </div>
  )
}

export const TodayPanel = ({ inProgress }: { inProgress: number }) => {
  const now = new Date()
  const weekday = new Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(
    now,
  )
  const day = new Intl.DateTimeFormat("en-GB", { day: "2-digit" }).format(now)
  const monthYear = new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(now)

  return (
    <section className="overflow-hidden rounded-2xl bg-white pb-3 shadow-[0_8px_18px_rgba(82,98,171,.07)]">
      <div className={railHeader}>
        <span className="text-[10px] font-bold uppercase tracking-[.06em]">
          Today’s plan
        </span>
        <span className={railIcon} aria-hidden="true">
          <CalendarDays size={15} />
        </span>
      </div>
      <div className="mx-4 my-3.5 flex items-baseline gap-2 rounded-lg bg-[#f1f3ff] p-3 text-[#7680a5]">
        <span className="text-[10px]">{weekday}</span>
        <strong className="text-[25px] tracking-[-1px] text-[#4b66d3]">
          {day}
        </strong>
        <span className="text-[10px]">{monthYear}</span>
      </div>
      <div className="px-4">
        {schedule.map((event) => (
          <div
            className="grid grid-cols-[35px_8px_1fr] gap-1.5 border-b border-dashed border-[#e4e6f0] py-2.5 last:border-0"
            key={event.time}
          >
            <time className="font-mono text-[9px] text-[#78819d]">
              {event.time}
            </time>
            <i className={`mt-1 size-1.5 rounded-full ${event.color}`} />
            <div>
              <strong className="block text-[10px] text-[#59617d]">
                {event.title}
              </strong>
              <span className="mt-0.5 block text-[9px] text-[#a4aabd]">
                {event.customer}
              </span>
            </div>
          </div>
        ))}
      </div>
      <a
        className="mx-4 mt-3 flex items-center justify-between text-[10px] text-[#5670d3]"
        href="#queue"
      >
        {inProgress} consultations in progress
        <ChevronRight size={15} />
      </a>
    </section>
  )
}

const getGreeting = (date: Date): "morning" | "afternoon" | "evening" => {
  if (date.getHours() < 12) return "morning"
  if (date.getHours() < 18) return "afternoon"
  return "evening"
}
