import { LayoutGrid, List } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ViewMode } from "../types/task"

type Props = {
  view: ViewMode
  onChange: (view: ViewMode) => void
}

export const ViewSwitcher = ({ view, onChange }: Props) => (
  <Tabs value={view} onValueChange={(value) => onChange(value as ViewMode)}>
    <TabsList className="h-auto bg-[#e8ebfa] p-[3px]">
      <TabsTrigger
        value="grid"
        className="size-8 p-0 data-[state=active]:bg-white data-[state=active]:text-[#4e6bd6]"
        aria-label="Grid view"
      >
        <LayoutGrid size={16} />
      </TabsTrigger>
      <TabsTrigger
        value="list"
        className="size-8 p-0 data-[state=active]:bg-white data-[state=active]:text-[#4e6bd6]"
        aria-label="List view"
      >
        <List size={16} />
      </TabsTrigger>
    </TabsList>
  </Tabs>
)
