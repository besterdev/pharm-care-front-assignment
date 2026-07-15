import type { PropsWithChildren } from "react"
import { DashboardHeader } from "./components/dashboard-header"
import { DashboardSidebar } from "./components/dashboard-sidebar"

type DashboardLayoutProps = PropsWithChildren<{
  isError: boolean
  isRefreshing: boolean
  onRefresh: () => void
}>

export const DashboardLayout = ({
  children,
  isError,
  isRefreshing,
  onRefresh,
}: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-dvh w-full overflow-hidden bg-[#f7f8ff]">
      <DashboardSidebar />
      <main
        className="w-full min-w-0 px-7 pb-[34px] max-[1180px]:px-5 max-sm:px-3 max-sm:pb-8"
        id="queue"
      >
        <DashboardHeader
          isError={isError}
          isRefreshing={isRefreshing}
          onRefresh={onRefresh}
        />
        {children}
      </main>
    </div>
  )
}
