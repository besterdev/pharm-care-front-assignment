import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { MotionConfig } from "framer-motion"
import { TooltipProvider } from "@/components/ui/tooltip"
import App from "./App"
import "./styles.css"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: 1 },
  },
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MotionConfig reducedMotion="user">
          <App />
        </MotionConfig>
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>,
)
