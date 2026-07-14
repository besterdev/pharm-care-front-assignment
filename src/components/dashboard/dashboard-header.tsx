import { RefreshCw } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

type Props = {
  isError: boolean
  isRefreshing: boolean
  onRefresh: () => void
}

export const DashboardHeader = ({ isError, isRefreshing, onRefresh }: Props) => (
  <header className="flex min-h-[82px] items-center justify-end gap-3 max-sm:min-h-[68px]">
    <div className="flex shrink-0 items-center gap-2">
      <span
        className={`mr-1.5 inline-flex items-center gap-1.5 font-mono text-[10px] ${isError ? 'text-[#a87547]' : 'text-[#4f8668]'} max-sm:hidden`}
      >
        <i
          className={`size-1.5 rounded-full ${isError ? 'bg-[#e1a064] shadow-[0_0_0_3px_#f7e8d8]' : 'bg-[#62b282] shadow-[0_0_0_3px_#dcefe2]'}`}
        />
        {isError ? 'Queue offline' : 'Live queue'}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={onRefresh}
        aria-label="Refresh consultations"
        disabled={isRefreshing}
      >
        <RefreshCw className={isRefreshing ? 'animate-spin' : ''} size={17} />
      </Button>
      <Avatar
        size="sm"
        className="size-[34px] bg-[#cfe8f3] font-mono text-[10px] text-[#3b6176] max-[420px]:hidden"
      >
        <AvatarFallback className="bg-transparent text-inherit">MP</AvatarFallback>
      </Avatar>
    </div>
  </header>
)
