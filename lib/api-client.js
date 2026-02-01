import { BASE_URL } from "@/utils/baseUrl"

const API_URL = BASE_URL
export const apiClient = {
  async get(endpoint) {
    const res = await fetch(`${API_URL}${endpoint}`)
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    return res.json()
  },

  async post(endpoint, data) {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    return res.json()
  },

  async put(endpoint, data) {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    return res.json()
  },

  async delete(endpoint) {
    const res = await fetch(`${API_URL}${endpoint}`, { method: "DELETE" })
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    return res.json()
  },
}
