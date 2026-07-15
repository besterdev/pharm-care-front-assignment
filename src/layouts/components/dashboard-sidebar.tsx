import { BellDot, Stethoscope } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export const DashboardSidebar = () => (
  <aside className="flex min-h-dvh w-[88px] shrink-0 flex-col items-center bg-gradient-to-b from-[#5570d9] to-[#3f5bc9] px-[13px] py-[22px] max-sm:w-[56px] max-sm:px-1.5 max-sm:py-3">
    <div className="grid size-[49px] place-items-center rounded-[14px_14px_14px_4px] bg-white/15 text-white">
      <Stethoscope size={19} />
    </div>
    <nav className="mt-8 max-sm:mt-5" aria-label="Workspace navigation">
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            className="grid size-12 place-items-center rounded-xl bg-white/20 text-white transition hover:bg-white/30"
            href="#queue"
            aria-label="Consultation queue"
          >
            <BellDot size={17} />
            <span className="sr-only">Consultation queue</span>
          </a>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={10}>
          Consultation queue
        </TooltipContent>
      </Tooltip>
    </nav>
    <div className="mt-auto grid size-[34px] place-items-center rounded-full bg-white font-mono text-[10px] text-[#3250b5] max-sm:size-8">
      MP
    </div>
  </aside>
)
