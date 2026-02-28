"use client"

import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"
import { BASE_URL } from "@/utils/baseUrl"

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

export default function MonthlyOrdersCompareChart({ month: propMonth, year: propYear }) {
  const now = new Date()
  const [month, setMonth] = useState(propMonth || now.getMonth() + 1)
  const [year, setYear] = useState(propYear || now.getFullYear())
  const [data, setData] = useState([])

  // Update local state when props change
  useEffect(() => {
    if (propMonth) setMonth(propMonth)
    if (propYear) setYear(propYear)
  }, [propMonth, propYear])

  useEffect(() => {
    fetch(
      `${BASE_URL}/api/orders/daily-by-month?month=${month}&year=${year}`
    )
      .then(res => res.ok ? res.json() : [])
      .then(setData)
      .catch(() => setData([]))
  }, [month, year])

  return (
    <div className="bg-white p-5 rounded-xl shadow mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <h3 className="text-lg font-semibold">
          Orders & Revenue by Month
        </h3>

        <div className="flex gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border rounded-lg px-3 py-2"
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border rounded-lg px-3 py-2"
          >
            {[2024, 2025, 2026].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />

            {/* Total Lines (Thinner) */}
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#6366f1"
              strokeWidth={1}
              name="Total Orders"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#a855f7"
              strokeWidth={1}
              name="Gross Revenue (৳)"
              dot={false}
            />

            {/* Delivered Lines (Thicker/Primary) */}
            <Line
              type="monotone"
              dataKey="deliveredOrders"
              stroke="#10b981"
              strokeWidth={3}
              name="Delivered Orders"
            />
            <Line
              type="monotone"
              dataKey="deliveredRevenue"
              stroke="#059669"
              strokeWidth={3}
              name="Delivered Revenue (৳)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
