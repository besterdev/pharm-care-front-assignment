import { useCallback, useEffect, useRef, useState } from "react"
import { useDebouncedValue } from "./use-debounced-value"
import type { DateRangeFilter, StatusFilter } from "@/types/task"

type QueueFilters = {
  query: string
  service: string
  status: StatusFilter
  dateRange: DateRangeFilter
  fromDate: string
  toDate: string
}

const defaults: QueueFilters = {
  query: "",
  service: "all",
  status: "all",
  dateRange: "all",
  fromDate: "",
  toDate: "",
}
const statuses = new Set<StatusFilter>([
  "all",
  "new",
  "in_progress",
  "completed",
])
const dateRanges = new Set<DateRangeFilter>([
  "all",
  "today",
  "this_week",
  "custom",
])
const services = new Set(["all", "video_call", "voice_call", "chat"])
const isDate = (value: string | null): value is string => {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return false
  const [year, month, day] = value.split("-").map(Number)
  return (
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day
  )
}

const readFilters = (): QueueFilters => {
  if (typeof window === "undefined") return defaults
  const params = new URLSearchParams(window.location.search)
  const dateRange = params.get("range") as DateRangeFilter
  const fromDate = isDate(params.get("from")) ? params.get("from")! : ""
  const candidateToDate = isDate(params.get("to")) ? params.get("to")! : ""
  const toDate =
    fromDate && candidateToDate && candidateToDate < fromDate
      ? ""
      : candidateToDate
  return {
    query: params.get("q") ?? "",
    service: services.has(params.get("service") ?? "")
      ? params.get("service")!
      : "all",
    status: statuses.has(params.get("status") as StatusFilter)
      ? (params.get("status") as StatusFilter)
      : "all",
    dateRange: dateRanges.has(dateRange) ? dateRange : "all",
    fromDate,
    toDate,
  }
}

const writeFilters = (filters: QueueFilters, mode: "push" | "replace") => {
  const url = new URL(window.location.href)
  ;["q", "service", "status", "range", "from", "to"].forEach((key) =>
    url.searchParams.delete(key),
  )
  if (filters.query) url.searchParams.set("q", filters.query)
  if (filters.service !== "all")
    url.searchParams.set("service", filters.service)
  if (filters.status !== "all") url.searchParams.set("status", filters.status)
  if (filters.dateRange !== "all")
    url.searchParams.set("range", filters.dateRange)
  if (filters.dateRange === "custom" && filters.fromDate)
    url.searchParams.set("from", filters.fromDate)
  if (filters.dateRange === "custom" && filters.toDate)
    url.searchParams.set("to", filters.toDate)
  const nextUrl = `${url.pathname}${url.search}${url.hash}`
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`
  if (nextUrl === currentUrl) return
  if (mode === "push") window.history.pushState(null, "", nextUrl)
  else window.history.replaceState(null, "", nextUrl)
}

export const useQueueFilters = () => {
  const [filters, setFilters] = useState<QueueFilters>(readFilters)
  const debouncedQuery = useDebouncedValue(filters.query, 300)
  const isFirstWrite = useRef(true)
  const isApplyingHistory = useRef(false)

  useEffect(() => {
    if (filters.query !== debouncedQuery) return
    if (isApplyingHistory.current) {
      isApplyingHistory.current = false
      return
    }
    writeFilters(
      { ...filters, query: debouncedQuery },
      isFirstWrite.current ? "replace" : "push",
    )
    isFirstWrite.current = false
  }, [filters, debouncedQuery])

  useEffect(() => {
    const handlePopState = () => {
      isApplyingHistory.current = true
      setFilters(readFilters())
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  const setQuery = useCallback(
    (query: string) => setFilters((current) => ({ ...current, query })),
    [],
  )
  const setService = useCallback(
    (service: string) => setFilters((current) => ({ ...current, service })),
    [],
  )
  const setStatus = useCallback(
    (status: StatusFilter) => setFilters((current) => ({ ...current, status })),
    [],
  )
  const setDateRange = useCallback(
    (dateRange: DateRangeFilter) =>
      setFilters((current) => ({
        ...current,
        dateRange,
        fromDate: dateRange === "custom" ? current.fromDate : "",
        toDate: dateRange === "custom" ? current.toDate : "",
      })),
    [],
  )
  const setFromDate = useCallback(
    (fromDate: string) => setFilters((current) => ({ ...current, fromDate })),
    [],
  )
  const setToDate = useCallback(
    (toDate: string) => setFilters((current) => ({ ...current, toDate })),
    [],
  )
  const resetFilters = useCallback(() => setFilters(defaults), [])

  return {
    filters,
    setQuery,
    setService,
    setStatus,
    setDateRange,
    setFromDate,
    setToDate,
    resetFilters,
  }
}
