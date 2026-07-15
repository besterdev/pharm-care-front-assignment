import axios from "axios"

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()
const baseURL = configuredBaseUrl?.replace(/\/+$/, "") || "/"

export const axiosInstance = axios.create({
  baseURL,
  headers: { Accept: "application/json" },
})
